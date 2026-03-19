import pymupdf
import docx
import csv
import re


def clean_text(text):
    if not text:
        return ""

    # Remove NULL bytes
    text = text.replace("\x00", "")

    # Remove control characters (except newline & tab)
    text = re.sub(r"[^\x09\x0A\x0D\x20-\x7E]", "", text)

    return text.strip()


def extract_text(file_path):

    if file_path.endswith(".pdf"):
        text = extract_pdf(file_path)

    elif file_path.endswith(".docx"):
        text = extract_docx(file_path)

    elif file_path.endswith(".txt"):
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
        
    elif file_path.endswith(".csv"):
        text = extract_csv(file_path)

    else:
        raise Exception("Unsupported file type")

    return clean_text(text)


def extract_pdf(path):
    doc = pymupdf.open(path)

    text = ""

    for page in doc:
        page_text = page.get_text() or ""
        text += page_text

    doc.close()

    return text


def extract_docx(path):
    doc = docx.Document(path)

    text = ""

    for para in doc.paragraphs:
        text += para.text + "\n"

    return text


def extract_csv(path):
    text = ""

    with open(path, "r", newline="", encoding="utf-8", errors="ignore") as file:
        reader = csv.reader(file)

        for row in reader:
            text += ", ".join(row) + "\n"

    return text