from rest_framework import serializers
from .models import Agent, Tag

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model= Agent
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'