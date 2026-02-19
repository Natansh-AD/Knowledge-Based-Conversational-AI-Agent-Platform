def get_tenant_from_db(domain):
    from django_tenants.utils import get_tenant_model
    TenantModel = get_tenant_model()
    try:
        tenant = TenantModel.objects.get(domains__domain__iexact=domain)
        return tenant
    except TenantModel.DoesNotExist:
        return None