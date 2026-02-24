
from django.contrib import admin
from django.urls import include, re_path,path

urlpatterns = [
    re_path(r'^admin/', admin.site.urls),
    re_path(
    r'^(?P<tenant_slug>.*?)/api/', include("core.urls")
    ),
    path('', include('core.urls')),
]
