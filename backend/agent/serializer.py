from rest_framework import serializers
from .models import Agent, Tag
from documents.models import Document

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id","name"]

class AgentSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True
    )
    tags_detail = TagSerializer(source="tags", many=True, read_only=True)

    documents = serializers.PrimaryKeyRelatedField(
        queryset=Document.objects.all(),
        write_only=True,
        many=True,
        required=False
    )

    documents_detail = serializers.SerializerMethodField()
    document_names = serializers.SerializerMethodField()
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Agent
        fields = [
            "id",
            "name",
            "description",
            "documents",
            "documents_detail",
            "document_names",
            "tags",
            "tags_detail",
            "created_by",
            "is_active",
            "system_prompt",
        ]

    def get_document_names(self, obj):
        return [doc.name for doc in obj.documents.all()]

    def get_documents_detail(self, obj):
        return [{"id": doc.id, "name": doc.name} for doc in obj.documents.all()]