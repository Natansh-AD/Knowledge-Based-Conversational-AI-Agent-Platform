import pymupdf
import docx
import csv


def extract_text(file_path):

    if file_path.endswith(".pdf"):
        return extract_pdf(file_path)

    elif file_path.endswith(".docx"):
        return extract_docx(file_path)

    elif file_path.endswith(".txt"):
        with open(file_path, "r") as f:
            return f.read()
        
    elif file_path.endswith(".csv"):
        return extract_csv(file_path)

    else:
        raise Exception("Unsupported file type")


def extract_pdf(path):
    doc = pymupdf.open(path)

    text = ""

    for page in doc:
        text += page.get_text()

    return text


def extract_docx(path):
    doc = docx.Document(path)

    text = ""

    for para in doc.paragraphs:
        text += para.text + "\n"

    return text

def extract_csv(path):
    text = ""
    with open(path, "r", newline="", encoding="utf-8") as file:
        reader = csv.reader(file)

        for row in reader:
            text += ", ".join(row) + "\n"

    return text