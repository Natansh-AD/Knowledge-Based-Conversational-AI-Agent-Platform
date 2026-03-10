from celery import shared_task
from .models import Document
from core.storage.s3 import S3Client
from django_tenants.utils import schema_context
from rag.pipepline import process_document_pipeline


@shared_task
def process_document(document_id, schema_name):

    with schema_context(schema_name):
        doc = Document.objects.get(id=document_id)

        doc.status = "processing"
        doc.save()
        client = S3Client()

        # later
        # download from s3
        file_path = client.download_file(doc.s3_key, doc.name)

        # chunk
        process_document_pipeline(doc, file_path)
        # embeddings

        doc.status = "ready"
        doc.save()