from agent.models import Agent
from rag.processors.retriever import retrieve_chunks,format_history
from rag.processors.chunker import build_context
from rag.llm.base import GeminiProvider
from rag.processors.embeddings import is_query_allowed


def generate_agent_answer(agent_id, question, history):

    agent = Agent.objects.get(id=agent_id)

    if not is_query_allowed(question):
        return "I can only answer questions related to the uploaded documents."

    chunks = retrieve_chunks(question, agent)

    # If similarity gate fails
    if chunks is None:
        return "I cannot find relevant information in the documents"

    context = build_context(chunks)

    provider = GeminiProvider()

    prompt = f"""
        Context:
        {context}

        Answer the question based ONLY on the provided context.

        If the context does not contain the answer, say:
        "I cannot find this information in the documents."

        Question: {question}
        """

    answer = provider.generate(
        system_prompt=agent.system_prompt,
        question=prompt,
        history=history
    )

    return answer