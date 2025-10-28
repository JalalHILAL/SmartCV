"""
In-memory storage service for analysis data.
Stores analysis progress and results during processing.
"""

from datetime import datetime

# In-memory storage for analysis data
analysis_storage = {}


def create_analysis(analysis_id, filename):
    """Initialize new analysis entry."""
    analysis_storage[analysis_id] = {
        "filename": filename,
        "status": "processing",
        "progress": 0,
        "step": 1,
        "result": None,
        "error": None,
        "created_at": datetime.utcnow().isoformat()
    }


def update_progress(analysis_id, progress, step, status):
    """Update analysis progress."""
    if analysis_id in analysis_storage:
        analysis_storage[analysis_id]["progress"] = progress
        analysis_storage[analysis_id]["step"] = step
        analysis_storage[analysis_id]["status"] = status


def store_result(analysis_id, result):
    """Store completed analysis results."""
    if analysis_id in analysis_storage:
        analysis_storage[analysis_id]["result"] = result
        analysis_storage[analysis_id]["status"] = "complete"


def get_analysis(analysis_id):
    """Retrieve analysis data."""
    return analysis_storage.get(analysis_id)


def mark_failed(analysis_id, error_message):
    """Mark analysis as failed."""
    if analysis_id in analysis_storage:
        analysis_storage[analysis_id]["status"] = "failed"
        analysis_storage[analysis_id]["error"] = error_message
