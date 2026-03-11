from sentence_transformers import SentenceTransformer
from documents.models import DocumentChunk
model = SentenceTransformer("all-MiniLM-L6-v2")

def generate_embeddings(texts):

    embeddings = model.encode(texts)

    return embeddings

def embed_document_chunks(document=None):
    chunks = DocumentChunk.objects.filter(
        document=document,
        embedding__isnull=True
    )

    texts = [c.text for c in chunks]
    embeddings = generate_embeddings(texts)

    for chunk, emb in zip(chunks, embeddings):
        chunk.embedding = emb.tolist()
    DocumentChunk.objects.bulk_update(
        chunks,
        ["embedding"]
    )