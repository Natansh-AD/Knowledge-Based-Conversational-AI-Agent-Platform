from django.urls import path
from .views import TenantDetailView

urlpatterns = [
    path("info/", TenantDetailView.as_view(), name="tenant-info"),
]
