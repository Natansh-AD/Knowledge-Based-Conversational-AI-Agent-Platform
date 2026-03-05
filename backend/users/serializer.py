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
            "role",
            "token"
            "phone_number",
            "email",
            "invited_by_id",
            "tenant_id",
            "status",
        ]

