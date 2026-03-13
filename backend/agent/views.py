from rag.processors.retriever import retrieve_chunks
from rag.processors.chunker import build_context
from rag.llm.base import GeminiProvider
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Agent, Tag
from .serializer import AgentSerializer, TagSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ask_agent(request, agent_id, tenant_slug=''):
    question = request.data.get("question")
    agent = Agent.objects.get(id=agent_id)
    chunks = retrieve_chunks(question, agent)

    context = build_context(chunks)
    print(len(context))

    provider = GeminiProvider()

    prompt = f"""
        Context:
        {context}

        Question:
        {question}
        """

    answer = provider.generate(
        system_prompt=agent.system_prompt,
        user_prompt=prompt
    )

    return Response({"answer" : answer})


class AgentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tenant_slug=''):
        agents = Agent.objects.all()
        serializer = AgentSerializer(agents,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, tenant_slug=''):
        serialzier = AgentSerializer(data=request.data)
        if serialzier.is_valid():
            serialzier.save(created_by = request.user)
            return Response(serialzier.data,status=status.HTTP_201_CREATED)
        else:
            return Response(serialzier.errors, status=status.HTTP_400_BAD_REQUEST)


class TagView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tenant_slug=''):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, tenant_slug=''):
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
