from django.contrib import admin

# Register your models here.
from .models import Organization, Domain

admin.site.register(Organization)
admin.site.register(Domain)