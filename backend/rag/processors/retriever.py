# rag.processors.retriever
from pgvector.django import CosineDistance
from documents.models import DocumentChunk
from agent.models import Agent
from rag.processors.embeddings import generate_embeddings
from chat.models import ChatMessage

AVG_SIMILARITY_THRESHOLD = 0.2
TOP_SIMILARITY_THRESHOLD = 0.4
def retrieve_chunks(query, agent, top_k=5):

    query_embedding = generate_embeddings([query])[0]
    agent_docs = agent.documents.values_list("id",flat=True)
    print(agent_docs)
    results = (
            DocumentChunk.objects
            .filter(document_id__in=agent_docs)
            .exclude(embedding__isnull=True)
            .annotate(distance=CosineDistance("embedding", query_embedding))
            .order_by("distance")
            .distinct()[:top_k]
    )

    results = list(results)
    # if not results:
    #     return None
    # print(results)
    similarities = [1 - r.distance for r in results]
    avg_similarity = sum(similarities)/ len(similarities)
    top_similarity = similarities[0]
    print(avg_similarity, top_similarity)
    if avg_similarity < AVG_SIMILARITY_THRESHOLD and top_similarity < TOP_SIMILARITY_THRESHOLD:
        return None
    
    return results

def get_history(chat):
    messages = ChatMessage.objects.filter(
        chat_session=chat
    ).order_by("created_at")
    messages = messages[:4][::-1]

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