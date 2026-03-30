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
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    document_names = serializers.SerializerMethodField()
    documents = serializers.PrimaryKeyRelatedField(
        queryset=Document.objects.all(),
        write_only=True,
        many=True,
        required=False
    )
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Agent
        fields = [
            "id",
            "name",
            "description",
            "documents",
            "document_names",
            "tags",
            "created_by",
            "is_active",
            "system_prompt",
            "tags_detail"
        ]
    def get_document_names(self, obj):
        return [doc.name for doc in obj.documents.all()]