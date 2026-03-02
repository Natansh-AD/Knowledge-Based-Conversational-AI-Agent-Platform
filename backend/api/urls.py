from django.urls import path
from .views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    LogoutView,
    ApiRootView,
    MeView
)

urlpatterns = [
    path("token/", CookieTokenObtainPairView.as_view()),
    path("token/refresh/", CookieTokenRefreshView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("", ApiRootView.as_view(), name="api-root"),
    path("me/", MeView.as_view(), name="me"),
]