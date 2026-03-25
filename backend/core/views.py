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
        print(f"Tenant in view: {tenant}")
        serializer = OrganizationSerializer(tenant)
        return Response(serializer.data)

class HomePageView(APIView):
    authentication_classes = []  # remove later if needed
    permission_classes = []

    def get(self, request, tenant_slug='public'):
        if request.tenant.schema_name != tenant_slug:
            return Response({"error": f"Tenant slug '{tenant_slug}' does not match the tenant in the request context."}, status=400)
        return Response({"message": f"Welcome to the multi-tenant Django app for tenant '{request.tenant.schema_name}'!"})