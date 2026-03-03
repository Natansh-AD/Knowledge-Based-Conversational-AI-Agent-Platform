from time import timezone
import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from .constants import UserConstants, InviteConstants
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _
from .managers import UserManager


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
    role = models.IntegerField(
        _("type"),
        choices=UserConstants.ROLE,
        blank=True,
        null=True,
        default=UserConstants.ROLE.member,
    )
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    phone_number = PhoneNumberField(_("phone number"), null=True, blank=True)
    tenant = models.ForeignKey("core.Organization", on_delete=models.CASCADE, related_name="invites")
    email = models.EmailField(_("email"), unique=True)
    invited_by = models.ForeignKey("users.User", on_delete=models.SET_NULL, null=True, related_name="sent_invites")
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_valid(self):
        return (not self.accepted and self.expires_at > timezone.now())

