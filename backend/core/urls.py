from django.urls import re_path, include
from .views import TenantDetailView, HomePageView
from users.views import UserListView

urlpatterns = [
    # Tenant info
    re_path(r'^(?P<tenant_slug>[\w-]+)/info/$', TenantDetailView.as_view(), name="tenant-info"),

    # Users list
    re_path(r'^(?P<tenant_slug>[\w-]+)/users/$', UserListView.as_view(), name="users-list"),

    # API routes
    re_path(r'^(?P<tenant_slug>[\w-]+)/api/', include('api.urls')),

    # Home page for tenant
    re_path(r'^(?P<tenant_slug>[\w-]+)/$', HomePageView.as_view(), name="home"),
]