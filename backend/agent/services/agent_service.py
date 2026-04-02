from agent.models import Agent
from rag.processors.retriever import retrieve_chunks
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
        chunks = None
        context_found = False
    else:
        context_found, chunks = retrieve_chunks(question, agent)

    context = build_context(chunks) if chunks else ""

    if context_found:
        instruction = """
        Answer the question based ONLY on the provided context.
        If the answer is not in the context, say you cannot find it.
        """
    else:
        instruction = """
        The user's question is outside the scope of the documentation.

        Politely explain that you cannot find the answer in the uploaded documents
        and tell the user you can only help with questions related to those documents.
        If the question is even slightly related to conetxt, then ask the user to try asking something related to the documentation by generating exactly 5 example question you can answer
        and offer help on how to ask good questions related to the documentation.
        """

    if chunks is None:
        context=""
    else:
        context = build_context(chunks)
    # print(context)

    provider = GeminiProvider()

    prompt = f"""
        Context:
        {context}

        {instruction}.

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