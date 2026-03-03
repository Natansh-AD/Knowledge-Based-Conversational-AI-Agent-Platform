from django.urls import path
from .views import handle_invite, UserListView, invite_user

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),
    path('invite/', handle_invite, name='handle-invite'),
    # path('invite/complete/<uuid:token>/', complete_invite, name='complete-invite'),
    path('invite/send/', invite_user, name='send-invite'),
]
