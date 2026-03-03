from datetime import timedelta
from django.utils import timezone
from .models import Invitation

def create_invite(email, tenant, invited_by):
    invite = Invitation.objects.create(
        email=email,
        tenant=tenant,
        invited_by=invited_by,
        expires_at=timezone.now() + timedelta(days=2)
    )
    return invite