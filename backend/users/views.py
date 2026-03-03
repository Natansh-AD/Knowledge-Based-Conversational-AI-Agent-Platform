from urllib import request
from django.shortcuts import render
from .models import User
from .serializer import UserSerializer
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Invitation
from .serializer import InvitationSerializer, CompleteInviteSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django_tenants.utils import tenant_context
from .services import create_invite
from .emails import send_invite_email



# Create your views here.
class UserListView(ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        tenant = self.request.tenant
        if tenant.schema_name == 'public':
            raise Exception("Invalid tenant: 'public' schema is not accessible for user data.")
        return User.objects.all()

@api_view(['GET'])
def validate_invite(request, token):
    try:
        invite = Invitation.objects.get(token=token)
    except Invitation.DoesNotExist:
        return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

    if not invite.is_valid():
        return Response({"detail": "Invite expired or already accepted"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = InvitationSerializer(invite)
    return Response(serializer.data)

@api_view(['POST'])
def complete_invite(request, token):

    serializer = CompleteInviteSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    serializer.is_valid(raise_exception=True)
    token = serializer.validated_data['token']
    username = serializer.validated_data['username']
    password = serializer.validated_data['password']


    try:
        invite = Invitation.objects.get(token=token)
    except Invitation.DoesNotExist:
        return Response({"detail": "Invalid invite"}, status=status.HTTP_404_NOT_FOUND)

    if not invite.is_valid():
        return Response({"detail": "Invite expired or used"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=invite.email).exists():
        return Response({"detail": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(
        username=username,
        email=invite.email,
        password=password,
        role=invite.role,
    )
    user.save()


    invite.accepted = True
    invite.save()


    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def invite_user(request, tenant_slug=''):
    email = request.data.get("email")
    
    if not email:
        return Response({"detail": "Email required"}, status=400)

    # prevent duplicate users
    if request.user.__class__.objects.filter(email=email).exists():
        return Response({"detail": "User already exists"}, status=400)

    with tenant_context(request.tenant):
        invite = create_invite(
            email=email,
            tenant=request.tenant,
            invited_by=request.user
        )
        send_invite_email(invite, request.tenant.schema_name)
    

    return Response({"detail": "Invite sent"})