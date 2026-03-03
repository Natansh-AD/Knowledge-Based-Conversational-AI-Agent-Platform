from .models import Invitation, User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "phone_number",
            "is_active",
            "role",
            "first_name",
            "last_name",
            "is_active",
            "date_joined",
            "role",
            "last_login",
        ]

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = [
            "id",
            "email",
            "phone_number",
            "role",
            "tenant",
            "invited_by",
            "created_at",
            "expires_at",
        ]

class CompleteInviteSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)