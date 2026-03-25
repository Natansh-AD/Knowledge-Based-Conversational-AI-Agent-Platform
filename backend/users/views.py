from urllib import request
from django.shortcuts import render
from .models import User
from .serializer import UserSerializer
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Invitation
from .serializer import InvitationSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django_tenants.utils import tenant_context
from .services import create_invite, getAllInvites
from .emails import send_invite_email
from rest_framework.views import APIView



# Create your views here.
class UserListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_queryset(self):
        tenant = self.request.tenant
        if tenant.schema_name == 'public':
            raise Exception("Invalid tenant: 'public' schema is not accessible for user data.")
        return User.objects.all()
    
class HandleUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tenant_slug=''):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, tenant_slug='', token=None):
        user = request.user
        print("Received data for update:", request.data)  # Debugging line
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])  # Disable authentication for this view
def handle_invite(request, tenant_slug='', token=None):
    token = request.data.get("token")

    if not token:
        return Response({"detail": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        invite = Invitation.objects.get(token=token)
    except Invitation.DoesNotExist:
        return Response({"detail": "Invalid invite token"}, status=status.HTTP_400_BAD_REQUEST)

    if not invite.is_valid():
        return Response(
            {"detail": "Invite expired or already accepted"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------
    # CASE 1: Only token sent → Just validate
    # -----------------------
    if not request.data.get("username") or not request.data.get("password"):
        serializer = InvitationSerializer(invite)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # -----------------------
    # CASE 2: Complete invite
    # -----------------------
    username = request.data.get("username")
    password = request.data.get("password")

    if User.objects.filter(email=invite.email).exists():
        return Response(
            {"detail": "User already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=invite.email,
        password=password,
        role=invite.role,
    )

    invite.mark_accepted()

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def invite_user(request, tenant_slug=''):
    email = request.data.get("email")
    print("Inviting user with email:", email)  # Debugging line
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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getInvitedUsers(request, tenant_slug=''):
    invites = getAllInvites(request.tenant).filter(invited_by_id=request.user.id)
    serializer = InvitationSerializer(invites, many=True)
    return Response(serializer.data, status=200)