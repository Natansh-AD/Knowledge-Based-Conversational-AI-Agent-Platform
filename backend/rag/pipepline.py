from rag.processors.extractor import extract_text
from rag.processors.chunker import chunk_text, save_chunks

def process_document_pipeline(document, file_path):
    text = extract_text(file_path)
    chunks = chunk_text(text)
    save_chunks(document,chunks)