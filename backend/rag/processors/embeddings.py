# rag.processors.embeddings.py
from sentence_transformers import SentenceTransformer
from documents.models import DocumentChunk
model = SentenceTransformer("all-MiniLM-L6-v2")

BLOCKED_PATTERNS = [
    "write code",
    "generate code",
    "python code",
    "tell a joke",
    "make a story",
    "weather",
    "movie recommendation",
    "solve this",
    "translate this",
]


def is_query_allowed(query: str) -> bool:
    q = query.lower()

    for pattern in BLOCKED_PATTERNS:
        if pattern in q:
            return False

    return True

def generate_embeddings(texts):

    embeddings = model.encode(texts)

    return embeddings.tolist()

def embed_document_chunks(document=None):
    chunks = DocumentChunk.objects.filter(
        document=document,
        embedding__isnull=True
    )

    texts = [c.text for c in chunks]
    embeddings = generate_embeddings(texts)

    for chunk, emb in zip(chunks, embeddings):
        chunk.embedding = emb
    DocumentChunk.objects.bulk_update(
        chunks,
        ["embedding"]
    )