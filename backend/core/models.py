from django.db import models
from django_tenants.models import TenantMixin, DomainMixin
from django.utils.translation import gettext_lazy as _


class Organization(TenantMixin):
    name = models.CharField(max_length=100)
    website = models.CharField(
        _("public website"), max_length=128, null=True, blank=True
    )
    billing_email = models.CharField(_("public email"), max_length=64, null=True, blank=True)
    billing_phone = models.CharField(_("public phone"), max_length=32, null=True, blank=True)
    created_on = models.DateField(auto_now_add=True)

    # default true, schema will be automatically created and synced when it is saved
    auto_create_schema = True

    def __str__(self):
        return self.name
    


class Domain(DomainMixin):
    pass