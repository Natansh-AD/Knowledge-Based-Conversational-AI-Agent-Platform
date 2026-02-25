from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Organization
from django_tenants.utils import tenant_context

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a user under a specific tenant'

    def add_arguments(self, parser):
        parser.add_argument('schema_name', type=str, help='Slug of the tenant')
        parser.add_argument('username', type=str, help='Username for the user')
        parser.add_argument('password', type=str, help='Password for the user')
        parser.add_argument('--email', type=str, help='Email address of the user', default='')

    def handle(self, *args, **kwargs):
        schema_name = kwargs['schema_name']
        username = kwargs['username']
        password = kwargs['password']
        email = kwargs['email']

        # Fetch tenant
        try:
            tenant = Organization.objects.get(schema_name=schema_name)
        except Organization.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Tenant "{schema_name}" does not exist'))
            return

        # Create user under tenant

        with tenant_context(tenant):
            user = User.objects.create_user(username=username, password=password, email=email)
            self.stdout.write(self.style.SUCCESS(f'User "{user.username}" created under tenant "{schema_name}"'))