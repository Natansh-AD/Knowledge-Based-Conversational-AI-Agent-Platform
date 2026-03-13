# rag.processors.retriever
from pgvector.django import CosineDistance
from documents.models import DocumentChunk
from agent.models import Agent
from rag.processors.embeddings import generate_embeddings

def retrieve_chunks(query, agent, top_k=5):

    query_embedding = generate_embeddings([query])[0]

    results = (
            DocumentChunk.objects
            .filter(document_id=agent.document_id)
            .exclude(embedding__isnull=True)
            .annotate(distance=CosineDistance("embedding", query_embedding))
            .order_by("distance")[:top_k]
    )

    return results