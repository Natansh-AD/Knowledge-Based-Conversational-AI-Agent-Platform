from celery import shared_task
from .models import Document

@shared_task
def process_document(document_id):
    doc = Document.objects.get(id=document_id)

    doc.status = "processing"
    doc.save()

    # later
    # download from s3
    # chunk
    # embeddings

    doc.status = "completed"
    doc.save()