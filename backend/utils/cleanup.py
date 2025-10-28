"""
File cleanup utility for removing old uploaded files.
"""

import os
import time


def cleanup_old_files(upload_folder, max_age_minutes=60):
    """
    Delete files older than max_age_minutes from upload folder.

    Args:
        upload_folder: Path to upload folder
        max_age_minutes: Maximum age of files to keep (default 60 minutes)
    """
    if not os.path.exists(upload_folder):
        return

    current_time = time.time()
    max_age_seconds = max_age_minutes * 60

    try:
        for filename in os.listdir(upload_folder):
            # Skip .gitkeep file
            if filename == '.gitkeep':
                continue

            file_path = os.path.join(upload_folder, filename)

            # Skip if not a file
            if not os.path.isfile(file_path):
                continue

            # Get file modification time
            file_age = current_time - os.path.getmtime(file_path)

            # Delete if older than max age
            if file_age > max_age_seconds:
                try:
                    os.remove(file_path)
                    print(f"Cleaned up old file: {filename}")
                except Exception as e:
                    print(f"Error deleting {filename}: {str(e)}")

    except Exception as e:
        print(f"Error during cleanup: {str(e)}")
