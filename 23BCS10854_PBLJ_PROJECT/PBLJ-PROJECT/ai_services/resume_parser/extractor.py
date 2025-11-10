# ai_services/resume_parser/extractor.py
import re
from PyPDF2 import PdfReader

def extract_text_from_resume(file_path):
    text = ""
    reader = PdfReader(file_path)
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def extract_skills(text):
    common_skills = [
        "python", "java", "react", "spring", "mongodb", "sql", "data analysis",
        "machine learning", "communication", "teamwork", "node.js", "docker"
    ]
    found = [skill for skill in common_skills if re.search(rf"\b{skill}\b", text, re.IGNORECASE)]
    return list(set(found))
