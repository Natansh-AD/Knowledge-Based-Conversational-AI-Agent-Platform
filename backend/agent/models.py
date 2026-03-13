# agent.models.py
from django.db import models

# Create your models here.
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    

class Agent(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    system_prompt = models.TextField()

    document = models.OneToOneField(
        "documents.Document",
        related_name="agents",
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE
    )

    tags = models.ManyToManyField(
        "Tag",
        related_name="agents",
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )