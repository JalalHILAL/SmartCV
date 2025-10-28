"""
Smart CV Checker - Flask Backend Application
Main application entry point.
"""

import os
import threading
import time
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from routes import analyze
from utils.cleanup import cleanup_old_files

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# CORS configuration for frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],  # Vite dev server
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10 MB max file size
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'uploads')

# Register blueprints
app.register_blueprint(analyze.bp, url_prefix='/api')


# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return {"error": "Endpoint not found"}, 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return {"error": "Internal server error"}, 500


@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large errors."""
    return {"error": "File too large"}, 413


def start_cleanup_task():
    """Start background cleanup task for old files."""
    def cleanup_loop():
        while True:
            time.sleep(900)  # Run every 15 minutes
            upload_folder = app.config['UPLOAD_FOLDER']
            cleanup_old_files(upload_folder, max_age_minutes=60)

    thread = threading.Thread(target=cleanup_loop)
    thread.daemon = True
    thread.start()


if __name__ == '__main__':
    # Create uploads directory if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Start background cleanup task
    start_cleanup_task()

    # Start Flask development server
    print("Starting Smart CV Checker backend on http://localhost:5000")
    app.run(debug=True, port=5000, host='0.0.0.0')
