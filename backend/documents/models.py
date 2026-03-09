from django.db import models
from users.models import User
# Create your models here.
class Document(models.Model):
    name = models.CharField(max_length=255)
    s3_key = models.CharField(max_length=500)
    file_type = models.CharField(max_length=50)

    status = models.CharField(
        choices=[('uploaded', 'Uploaded'), ('processing', 'Processing'), ('ready', 'Ready'), ('failed', 'Failed')],
        max_length=52, default='uploaded'
    )

    version = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    last_modified_at = models.DateTimeField(auto_now=True)