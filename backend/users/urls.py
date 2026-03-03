from django.urls import path
from .views import validate_invite, complete_invite, UserListView, invite_user

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),
    # path('invite/validate/<uuid:token>/', validate_invite, name='validate-invite'),
    # path('invite/complete/<uuid:token>/', complete_invite, name='complete-invite'),
    path('invite/send/', invite_user, name='send-invite'),
]
