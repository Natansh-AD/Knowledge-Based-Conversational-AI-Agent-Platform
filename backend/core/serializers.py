from rest_framework import serializers
from .models import Organization

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = [
            "id",
            "name",
            "schema_name",
            "created_on",
            "website",
            "billing_email",
            "billing_phone",
        ]
