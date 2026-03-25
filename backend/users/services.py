from datetime import timedelta
from django.utils import timezone
from .models import Invitation
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

User = get_user_model()

def create_invite(email, tenant, invited_by):
    invite = Invitation.objects.create(
        email=email,
        tenant=tenant,
        invited_by=invited_by,
        expires_at=timezone.now() + timedelta(days=2)
    )
    return invite

def getAllInvites(tenant):
    return Invitation.objects.filter(tenant=tenant)

def reset_user_password(uidb64: str, token: str, new_password: str):
    """
    Resets the password for a user if the token is valid.

    Args:
        uidb64: base64 encoded user ID
        token: password reset token
        new_password: new password to set

    Returns:
        tuple (success: bool, message: str)
    """
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (ObjectDoesNotExist, ValueError, TypeError):
        return False, "Invalid link."

    # Validate token
    if not default_token_generator.check_token(user, token):
        return False, "Invalid or expired token."

    # Set new password
    if not new_password:
        return False, "Password is required."

    user.set_password(new_password)
    user.save()
    return True, "Password reset successful."