"""
File parsing service for extracting text from PDF and DOCX files.
"""

import PyPDF2
import docx


def extract_text_from_file(file_path):
    """
    Extract text content from PDF or DOCX file.

    Args:
        file_path: Path to the file to parse

    Returns:
        String containing extracted text

    Raises:
        Exception: If file cannot be parsed or insufficient text found
    """
    file_lower = file_path.lower()

    if file_lower.endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    elif file_lower.endswith('.docx'):
        return extract_text_from_docx(file_path)
    else:
        raise Exception("Unsupported file type")


def extract_text_from_pdf(file_path):
    """Extract text from PDF file using PyPDF2."""
    try:
        text = ""
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)

            # Check if PDF is encrypted
            if reader.is_encrypted:
                raise Exception("Cannot read encrypted PDF")

            # Extract text from all pages
            for page in reader.pages:
                text += page.extract_text() + "\n"

        # Validate minimum text content
        if len(text.strip()) < 50:
            raise Exception("File appears to be scanned image")

        return text.strip()

    except PyPDF2.errors.PdfReadError:
        raise Exception("Unable to read PDF file")
    except Exception as e:
        if "encrypted" in str(e).lower() or "scanned" in str(e).lower():
            raise
        raise Exception("Unable to read PDF file")


def extract_text_from_docx(file_path):
    """Extract text from DOCX file using python-docx."""
    try:
        doc = docx.Document(file_path)

        # Extract all paragraph text
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])

        # Validate minimum text content
        if len(text.strip()) < 50:
            raise Exception("Insufficient text content found")

        return text.strip()

    except Exception as e:
        if "Insufficient" in str(e):
            raise
        raise Exception("Unable to read DOCX file")
