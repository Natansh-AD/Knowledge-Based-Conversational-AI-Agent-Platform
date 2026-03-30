# rag.processors.retriever
from pgvector.django import CosineDistance
from documents.models import DocumentChunk
from agent.models import Agent
from rag.processors.embeddings import generate_embeddings
from chat.models import ChatMessage
from sentence_transformers import CrossEncoder

AVG_SIMILARITY_THRESHOLD = 0.2
TOP_SIMILARITY_THRESHOLD = 0.4
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-12-v2')
def retrieve_chunks(query, agent, top_k=5, rerank_top_n=20):

    query_embedding = generate_embeddings([query])[0]
    agent_docs = agent.documents.values_list("id",flat=True)
    # print(agent_docs)
    results = (
            DocumentChunk.objects
            .filter(document_id__in=agent_docs)
            .exclude(embedding__isnull=True)
            .annotate(distance=CosineDistance("embedding", query_embedding))
            .order_by("distance")
            .distinct()[:rerank_top_n]
    )

    results = list(results)
    if not results:
        return None
    
    # Rerank with cross encoder
    pairs = [(query, c.text) for c in results]
    scores = reranker.predict(pairs)

    # sort by reranker score descending
    reranked_chunks = [chunk for _,chunk in sorted(zip(scores, results), reverse=True)]

    top_score = scores.max() if len(scores) else 0
    avg_score = scores.mean() if len(scores) else 0

    if avg_score < AVG_SIMILARITY_THRESHOLD and top_score < TOP_SIMILARITY_THRESHOLD:
        return None
    
    return reranked_chunks[:top_k]

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