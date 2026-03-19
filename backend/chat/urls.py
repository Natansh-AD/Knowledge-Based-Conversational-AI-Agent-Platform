from django.urls import path
from .views import *

urlpatterns = [
    path("create/", CreateChatSession.as_view()),
    path("list/", ListChats.as_view()),
    path("<int:chat_id>/messages/", ChatMessages.as_view()),
    path("<int:chat_id>/message/", SendMessage.as_view()),
]