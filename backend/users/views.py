from urllib import request
from django.shortcuts import render
from .models import User
from .serializer import UserSerializer
from rest_framework.generics import ListAPIView

# Create your views here.
class UserListView(ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        tenant = self.request.tenant
        if tenant.schema_name == 'public':
            raise Exception("Invalid tenant: 'public' schema is not accessible for user data.")
        return User.objects.all()
