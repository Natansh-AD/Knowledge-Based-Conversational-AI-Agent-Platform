# rag.processors.retriever
from pgvector.django import CosineDistance
from documents.models import DocumentChunk
from agent.models import Agent
from rag.processors.embeddings import generate_embeddings
from chat.models import ChatMessage

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

def get_history(chat):
    messages = ChatMessage.objects.filter(
        chat_session=chat
    ).order_by("created_at")
    messages = messages[:6][::-1]

    history = []
    for msg in messages:
        role = "model" if msg.role == "assistant" else "user"

        history.append({
            "role": role,
            "content": msg.content
        })
    return history

def format_history(history):
    lines = []
    for msg in history:
        role = "User" if msg["role"] == "user" else "Assistant"
        lines.append(f"{role}: {msg['content']}")
    return "\n".join(lines)