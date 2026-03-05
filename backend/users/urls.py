from django.urls import path
from .views import getInvitedUsers, handle_invite, UserListView, invite_user, HandleUser

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),
    path('invite/', handle_invite, name='handle-invite'),
    path('invites/', getInvitedUsers, name='get-invited-users'),
    path('profile/', HandleUser.as_view(), name='handle-user'),
    path('invite/send/', invite_user, name='send-invite'),
]
