"""
API routes for CV analysis endpoints.
"""

import os
import uuid
import threading
import time
from datetime import datetime
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from services import storage, file_parser, analyzer

bp = Blueprint('analyze', __name__)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def process_analysis(analysis_id, file_path, filename):
    """
    Background thread function to process CV analysis.
    Updates progress as analysis proceeds.
    """
    try:
        # Step 1: File uploaded (25%)
        storage.update_progress(analysis_id, 25, 1, "uploading")
        time.sleep(1)

        # Step 2: Extract text (50%)
        storage.update_progress(analysis_id, 50, 2, "extracting")
        text = file_parser.extract_text_from_file(file_path)
        time.sleep(1)

        # Step 3: Run AI analysis (75%)
        storage.update_progress(analysis_id, 75, 3, "analyzing")
        result = analyzer.analyze_cv(text, filename)
        time.sleep(2)

        # Step 4: Generate report (95%)
        storage.update_progress(analysis_id, 95, 4, "generating")

        # Add metadata to result
        result['analysis_id'] = analysis_id
        result['filename'] = filename
        result['analyzed_at'] = datetime.utcnow().isoformat() + 'Z'

        storage.store_result(analysis_id, result)

        # Complete (100%)
        storage.update_progress(analysis_id, 100, 4, "complete")

    except Exception as e:
        storage.mark_failed(analysis_id, str(e))


@bp.route('/analyze', methods=['POST'])
def upload_and_analyze():
    """
    POST /api/analyze
    Upload CV file and initiate analysis.
    """
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']

        # Check if filename exists
        if file.filename == '':
            return jsonify({"error": "Invalid file"}), 400

        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({"error": "Only PDF and DOCX files are allowed"}), 400

        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)

        if file_size > MAX_FILE_SIZE:
            return jsonify({"error": "File size exceeds 10 MB limit"}), 400

        # Generate unique analysis ID
        analysis_id = str(uuid.uuid4())

        # Secure filename and save
        original_filename = secure_filename(file.filename)
        filename = f"{analysis_id}_{original_filename}"
        upload_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
        file_path = os.path.join(upload_folder, filename)

        file.save(file_path)

        # Create analysis entry in storage
        storage.create_analysis(analysis_id, original_filename)

        # Start background analysis
        thread = threading.Thread(
            target=process_analysis,
            args=(analysis_id, file_path, original_filename)
        )
        thread.daemon = True
        thread.start()

        return jsonify({
            "analysis_id": analysis_id,
            "message": "Analysis started",
            "status": "processing"
        }), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@bp.route('/analysis/<analysis_id>/status', methods=['GET'])
def get_analysis_status(analysis_id):
    """
    GET /api/analysis/{analysis_id}/status
    Get current analysis progress.
    """
    try:
        analysis = storage.get_analysis(analysis_id)

        if not analysis:
            return jsonify({"error": "Analysis not found"}), 404

        # Map status to message
        status_messages = {
            "uploading": "File uploaded",
            "extracting": "Extracting text",
            "analyzing": "Running AI analysis",
            "generating": "Generating report",
            "complete": "Analysis complete",
            "failed": "Analysis failed"
        }

        message = status_messages.get(analysis['status'], "Processing")

        response = {
            "analysis_id": analysis_id,
            "progress": analysis['progress'],
            "status": analysis['status'],
            "step": analysis['step'],
            "message": message
        }

        # Include error if failed
        if analysis['status'] == 'failed' and analysis.get('error'):
            response['error'] = analysis['error']

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@bp.route('/analysis/<analysis_id>', methods=['GET'])
def get_analysis_results(analysis_id):
    """
    GET /api/analysis/{analysis_id}
    Retrieve completed analysis results.
    """
    try:
        analysis = storage.get_analysis(analysis_id)

        if not analysis:
            return jsonify({"error": "Analysis not found"}), 404

        if analysis['status'] != 'complete':
            return jsonify({"error": "Analysis not yet complete"}), 404

        if not analysis.get('result'):
            return jsonify({"error": "Analysis results not available"}), 404

        return jsonify(analysis['result']), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500
