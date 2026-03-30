from agent.models import Agent
from rag.processors.retriever import retrieve_chunks, format_history
from rag.processors.chunker import build_context
from rag.llm.base import GeminiProvider
from rag.processors.embeddings import is_query_allowed

# import cache utils
from agent.services.utils.cache import generate_cache_key, get_cache, set_cache


def generate_agent_answer(agent_id, question, history):
    # username 1. Generate cache key
    cache_key = generate_cache_key(agent_id, question)

    # username 2. Try cache first
    cached_response = get_cache(cache_key)
    if cached_response:
        print("CACHE HIT")
        return cached_response

    print("CACHE MISS")

    # your original logic starts
    agent = Agent.objects.get(id=agent_id)

    if not is_query_allowed(question):
        print("NOT ALLOWED")
        return "I can only answer questions related to the uploaded documents."

    chunks = retrieve_chunks(question, agent)

    # If similarity gate fails
    # if chunks is None:
    #     return "I cannot find relevant information in the documents"

    if chunks is None:
        context=""
    else:
        context = build_context(chunks)
    # print(context)

    provider = GeminiProvider()

    prompt = f"""
        Context:
        {context}

        Answer the question based ONLY on the provided context.

        If the context does not contain the answer, answer politely how can you help as an agent to user and ask if he needs to give more specific question.

        Question: {question}
        """

    answer = provider.generate(
        system_prompt=agent.system_prompt,
        question=prompt,
        history=history
    )

    # username 3. Store in cache (only if valid answer)
    if answer:
        set_cache(cache_key, answer)

    return answer