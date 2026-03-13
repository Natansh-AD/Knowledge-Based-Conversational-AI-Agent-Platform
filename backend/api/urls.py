from django.urls import path
from .views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    LogoutView,
    ApiRootView,
    MeView
)
from documents.views import get_upload_url, getAllDocuments, upload_document
from django.urls import include

urlpatterns = [
    path("token/", CookieTokenObtainPairView.as_view()),
    path("token/refresh/", CookieTokenRefreshView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("", ApiRootView.as_view(), name="api-root"),
    path("me/", MeView.as_view(), name="me"),

    # Document based paths
    path("upload/", upload_document, name="upload-document"),
    path("docs/",getAllDocuments,name="all-docs"),

    # Agent based paths
    path('agent/', include('agent.urls'))
]