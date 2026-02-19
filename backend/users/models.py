from django.contrib.auth.models import AbstractUser
from django.db import models
from .constants import UserConstants
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _


class User(AbstractUser, UserConstants):
    phone_number = PhoneNumberField(_("phone number"), null=True, blank=True)
    role = models.IntegerField(
        _("type"),
        choices=UserConstants.ROLE,
        blank=True,
        null=True,
        default=UserConstants.ROLE.member,
    )

    def __str__(self):
        return self.email
