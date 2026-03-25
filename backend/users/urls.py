from django.urls import path
from .views import getInvitedUsers, handle_invite, UserListView, invite_user, HandleUser, ForgotPasswordView, ResetPasswordView

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),
    path('invite/', handle_invite, name='handle-invite'),
    path('invites/', getInvitedUsers, name='get-invited-users'),
    path('profile/', HandleUser.as_view(), name='handle-user'),
    path('invite/send/', invite_user, name='send-invite'),
    path('forgot-password/', ForgotPasswordView.as_view(),name='forgot-password'),
    path('reset-password/<uidb64>/<token>/', ResetPasswordView.as_view(), name='reset-password'),
]
