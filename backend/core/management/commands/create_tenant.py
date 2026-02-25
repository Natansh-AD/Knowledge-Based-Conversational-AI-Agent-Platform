from django.core.management.base import BaseCommand
from core.models import Organization, Domain


class Command(BaseCommand):
    help = 'Create a new tenant with the specified schema name and domain'

    def add_arguments(self, parser):
        parser.add_argument('schema_name', type=str, help='Slug of the tenant (e.g., "tenant1")')
        parser.add_argument('name', type=str, help='Name of the tenant')
        parser.add_argument('domain_url', type=str, help='Domain URL for the tenant (e.g., "tenant1.example.com")')
        parser.add_argument('--website', type=str, help='Public website of the tenant', default='')
        parser.add_argument('--billing_email', type=str, help='Public email for billing', default='')
        parser.add_argument('--billing_phone', type=str, help='Public phone for billing', default='')

    def handle(self, *args, **kwargs):
        schema_name = kwargs['schema_name']
        domain_url = kwargs['domain_url']

        # Check if tenant already exists
        if Organization.objects.filter(schema_name=schema_name).exists():
            self.stdout.write(self.style.ERROR(f'Tenant with schema name "{schema_name}" already exists'))
            return

        # Create tenant
        tenant = Organization.objects.create(
            schema_name=schema_name,
            name=kwargs['name'],
            website=kwargs['website'],
            billing_email=kwargs['billing_email'],
            billing_phone=kwargs['billing_phone']
        )   
        Domain.objects.create(domain=domain_url, tenant=tenant)

        self.stdout.write(self.style.SUCCESS(f'Tenant "{schema_name}" created with domain "{domain_url}"'))
