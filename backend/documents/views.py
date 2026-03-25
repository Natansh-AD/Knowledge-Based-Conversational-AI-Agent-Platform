from django.shortcuts import render
from core.storage.s3 import S3Client
from core.storage.paths import tenant_document_path
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_tenants.utils import tenant_context
from .models import Document
from .serializer import DocumentSerializer
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from datetime import datetime, timedelta
from .tasks import process_document 
from django.db import connection 
from django.utils import timezone

# s3 views
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_upload_url(request, tenant_slug=None):
    tenant = request.tenant
    filename = request.data["filename"]
    content_type = request.data["content_type"]

    # update in db after uploading to s3 using the file_key returned here
    # everything will be handled in the background using signals and celery tasks

    key = tenant_document_path(tenant.id, filename)
    s3_client = S3Client()
    upload_url = s3_client.generate_upload_url(key,content_type)

    return Response({
        "upload_url": upload_url, 
        "file_key": key
        })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getAllDocuments(request, tenant_slug=None):
    """
    Get filtered, paginated documents.
    Filters (all optional):
        - search: name search
        - uploaded_by: user id (integer)
        - file_type
        - status
        - start_date, end_date: filter created_at
    Pagination:
        - page
        - page_size
    Ordering:
        - order_by
    """
    documents = Document.objects.all()

    # Filters
    search = request.GET.get("search")
    uploaded_by = request.GET.get("uploaded_by")
    file_type_param = request.GET.get("file_type")
    file_type = file_type_param.split(",") if file_type_param else []
    status_filter = request.GET.get("status")
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")

    # Initialize date variables
    start_dt = None
    end_dt = None

    # Search filter
    if search:
        documents = documents.filter(name__icontains=search)

    # Uploaded by filter (convert to int)
    if uploaded_by:
        try:
            uploaded_by = int(uploaded_by)
            documents = documents.filter(uploaded_by__id=uploaded_by)
        except ValueError:
            pass

    # File type filter
    if file_type:
        documents = documents.filter(file_type__in=file_type)

    # Status filter
    if status_filter:
        documents = documents.filter(status=status_filter)

    # Date filters
    if start_date:
        try:
            start_dt = timezone.make_aware(datetime.strptime(start_date, "%Y-%m-%d"))
        except ValueError:
            start_dt = None
    if end_date:
        try:
            end_dt = timezone.make_aware(
                datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1) - timedelta(seconds=1)
            )
        except ValueError:
            end_dt = None

    # Apply date filters safely
    if start_dt and end_dt:
        documents = documents.filter(created_at__range=[start_dt, end_dt])
    elif start_dt:
        documents = documents.filter(created_at__gte=start_dt)
    elif end_dt:
        documents = documents.filter(created_at__lte=end_dt)

    # Ordering
    order_by = request.GET.get("order_by", "-created_at")
    documents = documents.order_by(order_by)

    # Pagination
    page = int(request.GET.get("page", 1))
    page_size = int(request.GET.get("page_size", 10))
    paginator = Paginator(documents, page_size)

    try:
        docs_page = paginator.page(page)
    except PageNotAnInteger:
        docs_page = paginator.page(1)
    except EmptyPage:
        docs_page = paginator.page(paginator.num_pages)

    # Serialize data
    serializer = DocumentSerializer(docs_page, many=True)

    return Response({
        "count": paginator.count,
        "num_pages": paginator.num_pages,
        "current_page": docs_page.number,
        "results": serializer.data
    }, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_document(request,tenant_slug=None):

    file = request.FILES.get("file")

    if not file:
        return Response({"error": "No file uploaded"}, status=400)

    tenant = request.tenant

    key = tenant_document_path(tenant.id, file.name)

    s3_client = S3Client()
    s3_client.upload_file(file, key, file.content_type)

    document = Document.objects.create(
        name=file.name,
        s3_key=key,
        file_type=file.content_type,
        uploaded_by=request.user,
        status="uploaded"
    )
    process_document.delay(document.id, request.tenant.schema_name)

    return Response({
        "message": "File uploaded successfully",
        "document_id": document.id
    })