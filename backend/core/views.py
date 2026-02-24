from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import OrganizationSerializer

class TenantDetailView(APIView):
    authentication_classes = []  # remove later if needed
    permission_classes = []

    def get(self, request, tenant_slug=''):
        if tenant_slug=='':
            tenant_slug = request.tenant.schema_name
        tenant = request.tenant  # set by your middleware
        serializer = OrganizationSerializer(tenant)
        return Response(serializer.data)

class HomePageView(APIView):
    authentication_classes = []  # remove later if needed
    permission_classes = []

    def get(self, request, tenant_slug=''):
        if tenant_slug=='':
            tenant_slug = request.tenant.schema_name
        return Response({"message": f"Welcome to the multi-tenant Django app for tenant '{tenant_slug}'!"})