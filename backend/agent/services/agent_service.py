from agent.models import Agent
from rag.processors.retriever import retrieve_chunks
from rag.processors.chunker import build_context
from rag.llm.base import GeminiProvider
from rag.processors.embeddings import is_query_allowed

from agent.services.utils.cache import generate_cache_key, get_cache, set_cache


def generate_agent_answer(agent_id, question, history):
    # 1.Cache
    cache_key = generate_cache_key(agent_id, question)
    cached_response = get_cache(cache_key)
    if cached_response:
        print("CACHE HIT")
        return cached_response

    print("CACHE MISS")

    agent = Agent.objects.get(id=agent_id)
    provider = GeminiProvider()

    # 2.Guardrail: check if query is allowed
    if not is_query_allowed(question):
        answer = generate_fallback_llm(agent, question, history)
        if answer:
            set_cache(cache_key, answer)
        return answer

    # 3.Retrieval
    result = retrieve_chunks(question, agent)
    status = result.get("status", "low")
    chunks = result.get("chunks", [])
    top_score = result.get("top_score", 0.0)

    print(result)

    # 4.Routing Logic
    if status == "low":
        answer = generate_fallback_llm(agent, question, history, chunks)
        if answer:
            set_cache(cache_key, answer)
        return answer

    elif status in ["partial", "ambiguous"]:
        answer = generate_clarification_llm(agent, question, chunks, history)
        if answer:
            set_cache(cache_key, answer)
        return answer

    elif status == "high":
        # Handle edge case: no chunks
        if not chunks:
            answer = generate_fallback_llm(agent, question, history)
            if answer:
                set_cache(cache_key, answer)
            return answer

        # Build context safely
        context = build_context(chunks) if chunks else ""

        prompt = f"""
        Context:
        {context}

        Answer ONLY from the context.
        If the answer is not present, say you cannot find it.

        Question: {question}
        """

        answer = provider.generate(
            system_prompt=agent.system_prompt,
            question=prompt,
            history=history
        )

        if answer:
            set_cache(cache_key, answer)

        return answer

    # Safety fallback
    answer = generate_fallback_llm(agent, question, history)
    if answer:
        set_cache(cache_key, answer)
    return answer


def generate_fallback_llm(agent, question, history, chunks=None):
    """
    Generate fallback response when query is out-of-scope.
    Optionally show top chunk previews for richer suggestions.
    """
    doc_titles = list(agent.documents.values_list("name", flat=True))[:5]
    chunk_preview = ""
    if chunks:
        chunk_preview = "\n".join([c.text[:200] for c in chunks[:2]])

    provider = GeminiProvider()

    prompt = f"""
    User asked: "{question}"

    This question is outside the scope of the available documents.

    The agent can help with topics related to:
    {doc_titles}

    {f'Example content from documents:\n{chunk_preview}' if chunk_preview else ''}

    Instructions:
    - Politely say you couldn't find an exact answer
    - Clearly explain what you CAN help with
    - Suggest 3–5 example questions
    - Keep it natural and helpful
    - DO NOT answer the original question
    """

    return provider.generate(
        system_prompt="You are a helpful assistant guiding users.",
        question=prompt,
        history=history
    )


def generate_clarification_llm(agent, question, chunks, history):
    """
    Generate clarification prompt when retrieval is partial or ambiguous.
    """
    context_preview = "\n".join([c.text[:200] for c in chunks[:3]]) if chunks else ""

    provider = GeminiProvider()

    prompt = f"""
    User asked: "{question}"

    Some partially relevant information was found:
    {context_preview}

    Instructions:
    - Ask the user to clarify their question
    - Suggest 2–3 possible interpretations
    - Keep it short and helpful
    - DO NOT assume the answer
    """

    return provider.generate(
        system_prompt="You help users refine their questions.",
        question=prompt,
        history=history
    )