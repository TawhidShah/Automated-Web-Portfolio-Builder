import io
import json
import os
import tempfile
from resume_parser import extract_text_from_pdf, extract_text_from_docx, extract_text, resume_parser
from werkzeug.datastructures import FileStorage
from pathlib import Path


def get_fixture_resume_path(filename):
    """Helper using pathlib to locate fixture resumes."""
    return str(Path(__file__).parent.parent / "fixtures" / "resumes" / filename)


PDF_PATH = get_fixture_resume_path("resume.pdf")
DOCX_PATH = get_fixture_resume_path("resume.docx")

PDF_EXPECTED_OUTPUT_PATH = get_fixture_resume_path("extraction_output_pdf.txt")
DOCX_EXPECTED_OUTPUT_PATH = get_fixture_resume_path(
    "extraction_output_docx.txt")


class MockResponse:
    def __init__(self, content):
        self.choices = [self]
        self.message = self
        self.content = content


class MockOpenAIClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.beta = self
        self.chat = self
        self.completions = self

    def parse(self, model, messages, response_format):
        # Create a dummy structured resume data.
        dummy_data = {
            "personal": {
                "name": "John Doe",
                "job_title": "Software Developer",
                "email": "john.doe@example.com",
                "phone": "123-456-7890",
                "linkedin": "linkedin.com/in/johndoe",
                "github": "github.com/johndoe",
                "location": "London"
            },
            "professional_summary": "Experienced developer.",
            "education": [],
            "experience": [],
            "skills": {"technical": ["Python", "Flask"], "soft": ["Communication"]},
            "projects": [],
            "certifications": []
        }
        json_str = json.dumps(dummy_data)
        return MockResponse(json_str)


def test_extract_text_from_pdf_real():
    """Test PDF extraction using a real PDF file."""
    with open(PDF_PATH, "rb") as f:
        text = extract_text_from_pdf(f)

    with open(PDF_EXPECTED_OUTPUT_PATH, "r", encoding="utf-8") as f:
        expected_text = f.read()

    assert isinstance(text, str), "PDF extraction should return a string"
    assert len(text) > 0, "Extracted PDF text should not be empty"
    assert text == expected_text, "Extracted PDF text does not match expected output"


def test_extract_text_from_docx_real():
    """Test DOCX extraction using a real DOCX file."""
    with open(DOCX_PATH, "rb") as f:
        text = extract_text_from_docx(f)

    with open(DOCX_EXPECTED_OUTPUT_PATH, "r", encoding="utf-8") as f:
        expected_text = f.read()

    assert isinstance(text, str), "DOCX extraction should return a string"
    assert len(text) > 0, "Extracted DOCX text should not be empty"
    assert text == expected_text, "Extracted DOCX text does not match expected output"


def test_extract_text_pdf_real_fs():
    """Test extract_text on a PDF file wrapped in a FileStorage object."""
    with open(PDF_PATH, "rb") as f:
        fs = FileStorage(stream=f, filename="resume.pdf",
                         content_type="application/pdf")
        text = extract_text(fs)

    with open(PDF_EXPECTED_OUTPUT_PATH, "r", encoding="utf-8") as f:
        expected_text = f.read()

    assert isinstance(
        text, str), "extract_text should return a string for a PDF file"
    assert len(text) > 0, "Extracted PDF text should not be empty"
    assert text == expected_text, "Extracted PDF text does not match expected output"


def test_extract_text_docx_real_fs():
    """Test extract_text on a DOCX file wrapped in a FileStorage object."""
    with open(DOCX_PATH, "rb") as f:
        fs = FileStorage(
            stream=f,
            filename="resume.docx",
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        text = extract_text(fs)

    with open(DOCX_EXPECTED_OUTPUT_PATH, "r", encoding="utf-8") as f:
        expected_text = f.read()

    assert isinstance(
        text, str), "extract_text should return a string for a DOCX file"
    assert len(text) > 0, "Extracted DOCX text should not be empty"
    assert text == expected_text, "Extracted DOCX text does not match expected output"


def test_extract_text_unsupported_file_fs():
    """Test extract_text returns an error for an unsupported file type."""
    # Create a temporary file with an unsupported mimetype
    with tempfile.NamedTemporaryFile("wb", delete=False) as tmp:
        tmp.write(b"Unsupported")
        tmp_filename = tmp.name

    with open(tmp_filename, "rb") as f:
        fs = FileStorage(stream=f, filename="unsupported.txt",
                         content_type="text/plain")
        result = extract_text(fs)
    os.remove(tmp_filename)
    assert result == {
        "error": "Unsupported file type. Please upload a PDF or DOCX file."}


def test_extract_text_no_mimetype():
    """Test that extract_text returns an error when the file object has no mimetype attribute."""
    with open(PDF_PATH, "rb") as f:
        result = extract_text(f)
    assert result == {"error": "File object has no mimetype attribute."}


def test_resume_parser(monkeypatch):
    """
    Test that resume_parser returns the expected structured data.
    """

    monkeypatch.setattr("resume_parser.extract_text",
                        lambda file: "Resume text")

    monkeypatch.setattr("resume_parser.OpenAI", MockOpenAIClient)

    dummy_file = io.BytesIO(b"dummy content")
    dummy_file.mimetype = "application/pdf"

    result = resume_parser(dummy_file)

    expected_data = {
        "personal": {
            "name": "John Doe",
            "job_title": "Software Developer",
            "email": "john.doe@example.com",
            "phone": "123-456-7890",
            "linkedin": "linkedin.com/in/johndoe",
            "github": "github.com/johndoe",
            "location": "London"
        },
        "professional_summary": "Experienced developer.",
        "education": [],
        "experience": [],
        "skills": {"technical": ["Python", "Flask"], "soft": ["Communication"]},
        "projects": [],
        "certifications": []
    }

    assert result == expected_data
