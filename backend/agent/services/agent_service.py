from agent.models import Agent
from rag.processors.retriever import retrieve_chunks,format_history
from rag.processors.chunker import build_context
from rag.llm.base import GeminiProvider


def generate_agent_answer(agent_id, question, history):
    agent = Agent.objects.get(id=agent_id)
    chunks = retrieve_chunks(question, agent)
    context = build_context(chunks)

    provider = GeminiProvider()

    prompt = f"""
    Context:
    {context}


    Answer the question based on the context
    Question : {question}
    """
    answer = provider.generate(
        system_prompt=agent.system_prompt,
        question=prompt,
        history=history
    )
    return answer