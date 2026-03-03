from django.core.mail import send_mail
from django.conf import settings

def send_invite_email(invite, tenant_slug=''):
    invite_link = f"localhost:5173/{tenant_slug}/invite/{invite.token}"

    send_mail(
        subject="You are invited",
        message=f"Click to join: {invite_link}",
        from_email="natansh.me05@gmail.com",
        recipient_list=[invite.email],
        fail_silently=False,
    )