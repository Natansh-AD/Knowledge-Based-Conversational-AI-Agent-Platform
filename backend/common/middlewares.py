from urllib.parse import unquote, urlparse
from django_tenants.middleware import TenantMainMiddleware
from django.db import connection
from django_tenants.utils import get_tenant_model, get_public_schema_name

class PathBasedTenantMiddleware(TenantMainMiddleware):
    """
    Determines tenant by the value of the first part of url e.g. awaaz.de/org.
    """
    def get_tenant(self, model, hostname, request):
        from .utils import get_tenant_from_db
        path = unquote(urlparse(request.get_full_path()).path)
        print(f"Extracted path: '{path}' from request URL: '{request.get_full_path()}'")
        if path :
            org_name = path.split('/')[1]
            print(f"Extracted org_name: '{org_name}'")
            domain = hostname + '/' + org_name

            tenant = get_tenant_from_db(domain)
            print(f"Tenant found for domain '{domain}': {tenant}")
            if tenant:
                return tenant
            else:
                return model.objects.get(schema_name='public')
            

    def process_request(self, request):
        connection.set_schema_to_public()
        hostname = self.hostname_from_request(request)  
        model = get_tenant_model()

        try:
            tenant = self.get_tenant(model, hostname, request)
        except model.DoesNotExist:
            raise self.TENANT_NOT_FOUND_EXCEPTION(
                'No tenant for hostname "%s"' % hostname
            )
        tenant.domain_url = hostname
        request.tenant = tenant
        print(f"Tenant set to: {tenant}")

        connection.set_tenant(request.tenant)
    