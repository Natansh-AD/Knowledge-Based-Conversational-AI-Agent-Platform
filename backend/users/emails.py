from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

def send_invite_email(invite, tenant_slug=''):
    invite_link = f"localhost:5173/{tenant_slug}/invite/{invite.token}"

    send_mail(
        subject="You are invited",
        message=f"Click to join: {invite_link}",
        from_email="natansh.me05@gmail.com",
        recipient_list=[invite.email],
        fail_silently=False,
    )

def send_password_reset_email(user, tenant_slug=''):
    """
    Sends a password reset email to the user with a unique reset link.
    
    Args:
        user: Django User instance
        tenant_slug: Optional organization/tenant slug for multi-tenant apps
    """
    # Generate token and UID
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Construct the reset link
    reset_link = f"http://localhost:5173/{tenant_slug}/reset-password/{uid}/{token}/"
    
    # Send the email
    send_mail(
        subject="Reset Your Password",
        message=f"Hello {user.username},\n\n"
                f"You requested a password reset. Click the link below to reset your password:\n\n"
                f"{reset_link}\n\n"
                "If you didn't request this, please ignore this email.\n\n"
                "Thanks!",
        from_email="natansh.me05@gmail.com",
        recipient_list=[user.email],
        fail_silently=False,
    )