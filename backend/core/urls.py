from django.urls import path, re_path
from .views import TenantDetailView,HomePageView

urlpatterns = [
    path("info/", TenantDetailView.as_view(), name="tenant-info"),
    re_path(r'^(?P<tenant_slug>[\w-]+)?/?$', HomePageView.as_view(), name="home"),
]
