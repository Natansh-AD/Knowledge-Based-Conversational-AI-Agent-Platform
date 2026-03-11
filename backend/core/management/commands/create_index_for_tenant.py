# your_app/management/commands/create_index_for_tenant.py
from django.core.management.base import BaseCommand
# from django.db import connections
# from django_tenants.utils import set_tenant_schema
# from django_tenants.models import TenantMixin


class Command(BaseCommand):
    help = 'Create HNSW Index for a specific tenant schema'

    def add_arguments(self, parser):
        # Add the schema_name argument to the command
        parser.add_argument('schema_name', type=str, help='The schema name of the tenant')

    def handle(self, *args, **options):
        schema_name = options['schema_name']
        self.stdout.write(f"Implementation is left, pls wait for some time\n you can run command manually tho : \n" \
        '''CREATE INDEX document_chunk_embedding_idx
        ON "${schema_name}".documents_documentchunk
        USING hnsw (embedding vector_cosine_ops);
        ''')

    # def set_schema_and_create_index(self, schema_name):
    #     try:
    #         # Retrieve the tenant instance
    #         tenant = self.get_tenant_by_schema_name(schema_name)

    #         # Switch to the tenant schema
    #         set_tenant_schema(tenant)

    #         # Create the index in the schema
    #         with connections['default'].cursor() as cursor:
    #             cursor.execute('''
    #                 CREATE INDEX IF NOT EXISTS document_chunk_embedding_idx
    #                 ON documents_documentchunk
    #                 USING hnsw (embedding vector_cosine_ops);
    #             ''')
    #             self.stdout.write(self.style.SUCCESS(f"Index created for tenant schema: {schema_name}"))

    #     except TenantMixin.DoesNotExist:
    #         self.stdout.write(self.style.ERROR(f"Tenant with schema {schema_name} does not exist"))
    #     except Exception as e:
    #         self.stdout.write(self.style.ERROR(f"Error creating index for schema {schema_name}: {str(e)}"))

    # def get_tenant_by_schema_name(self, schema_name):
    #     # Assuming you have a Tenant model that inherits from TenantMixin
    #     from django_tenants.utils import get_tenant_model
    #     Tenant = get_tenant_model()
    #     try:
    #         return Tenant.objects.get(schema_name=schema_name)
    #     except Tenant.DoesNotExist:
    #         raise TenantMixin.DoesNotExist(f"Tenant with schema {schema_name} does not exist")