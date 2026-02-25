
from django.contrib import admin
from django.urls import include, re_path,path

urlpatterns = [
    path('', include('core.urls')),
]
