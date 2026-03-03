from django.utils import timezone
import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from .constants import UserConstants, InviteConstants
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _
from .managers import UserManager

def default_expiry():
    return timezone.now() + timezone.timedelta(days=2)

class User(AbstractUser, UserConstants):
    phone_number = PhoneNumberField(_("phone number"), null=True, blank=True)
    role = models.IntegerField(
        _("type"),
        choices=UserConstants.ROLE,
        blank=True,
        null=True,
        default=UserConstants.ROLE.member,
    )
    objects = UserManager()
    def __str__(self):
        return self.email
    
class Invitation(models.Model, InviteConstants):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        EXPIRED = "expired", "Expired"
        REVOKED = "revoked", "Revoked"

    role = models.IntegerField(
        _("role"),
        choices=UserConstants.ROLE,
        default=UserConstants.ROLE.member,
        null=True,
        blank=True,
    )

    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    phone_number = PhoneNumberField(
        _("phone number"),
        null=True,
        blank=True
    )

    tenant = models.ForeignKey(
        "core.Organization",
        on_delete=models.CASCADE,
        related_name="invites"
    )

    email = models.EmailField(_("email"))

    invited_by = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="sent_invites"
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)

    expires_at = models.DateTimeField(default=default_expiry)

    class Meta:
        unique_together = ("tenant", "email")  # prevent duplicate invites per tenant

    def is_valid(self):
        """
        Invite is valid only if:
        - Status is pending
        - Not expired
        """
        if self.status != self.Status.PENDING:
            return False

        if self.expires_at <= timezone.now():
            # auto mark expired (optional but nice)
            self.status = self.Status.EXPIRED
            self.save(update_fields=["status"])
            return False

        return True

    def mark_accepted(self):
        self.status = self.Status.ACCEPTED
        self.save(update_fields=["status"])

    def mark_revoked(self):
        self.status = self.Status.REVOKED
        self.save(update_fields=["status"])

    def __str__(self):
        return f"{self.email} → {self.tenant.name} ({self.status})"