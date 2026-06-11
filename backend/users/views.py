<<<<<<< HEAD
import json
import secrets
import urllib.request
import urllib.error
import logging
from rest_framework import generics, status
from rest_framework_simplejwt.views import TokenObtainPairView

auth_logger = logging.getLogger("auth")
errors_logger = logging.getLogger("django")

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                auth_logger.info(f"User '{username}' successfully logged in (JWT Token issued).")
            else:
                auth_logger.warning(f"Failed login attempt for username '{username}'. Status: {response.status_code}")
            return response
        except Exception as e:
            auth_logger.warning(f"Failed login attempt for username '{username}'. Exception: {e}")
            raise e
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import User, PasswordResetToken
from .serializers import RegisterSerializer

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

def verify_google_token(token):
    if token.startswith("mock_google_token_"):
        email = token.replace("mock_google_token_", "")
        username = email.split("@")[0]
        return {
            "email": email,
            "name": username.capitalize(),
            "picture": None
        }
    try:
        url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req) as response:
            payload = json.loads(response.read().decode("utf-8"))
            return {
                "email": payload.get("email"),
                "name": payload.get("name"),
                "picture": payload.get("picture")
            }
    except Exception as e:
        print(f"Google Token Verification Error: {e}")
        return None

def verify_facebook_token(token):
    if token.startswith("mock_facebook_token_"):
        email = token.replace("mock_facebook_token_", "")
        username = email.split("@")[0]
        return {
            "email": email,
            "name": username.capitalize(),
            "picture": None
        }
    try:
        url = f"https://graph.facebook.com/me?fields=id,name,email,picture&access_token={token}"
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req) as response:
            payload = json.loads(response.read().decode("utf-8"))
            picture = payload.get("picture", {}).get("data", {}).get("url")
            return {
                "email": payload.get("email"),
                "name": payload.get("name"),
                "picture": picture
            }
    except Exception as e:
        print(f"Facebook Token Verification Error: {e}")
        return None

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        auth_logger.info(f"New user registered: '{user.username}' (Email: {user.email})")

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "profile_pic": request.user.profile_pic.url if request.user.profile_pic else None,
            "banner_image": request.user.banner_image.url if request.user.banner_image else None,
            "bio": request.user.bio,
            "date_of_birth": request.user.date_of_birth,
        })

class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "If email is registered, a reset link will be sent."})

        # Generate token
        reset_token = PasswordResetToken.objects.create(user=user)
        
        # Log/Print token for developer testing
        print(f"PASSWORD RESET LINK: http://localhost:5173/reset-password?token={reset_token.token}")
        auth_logger.info(f"Password reset token generated for user '{user.username}' (Email: {user.email})")
        
        return Response({
            "message": "Password reset token sent successfully.",
            "token": reset_token.token
        })

class ResetPasswordView(APIView):
    def post(self, request):
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not token or not new_password:
            return Response({"error": "Token and new_password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reset_token = PasswordResetToken.objects.get(token=token, is_used=False)
        except PasswordResetToken.DoesNotExist:
            auth_logger.warning("Password reset attempted with invalid or used token")
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        if reset_token.is_expired():
            auth_logger.warning(f"Password reset attempted with expired token for user '{reset_token.user.username}'")
            return Response({"error": "Token has expired"}, status=status.HTTP_400_BAD_REQUEST)

        user = reset_token.user
        user.set_password(new_password)
        user.save()

        reset_token.is_used = True
        reset_token.save()

        auth_logger.info(f"Password successfully reset for user '{user.username}'")
        return Response({"message": "Password reset successful."})

class GoogleLoginView(APIView):
    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

        user_info = verify_google_token(token)
        if not user_info or not user_info.get("email"):
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

        email = user_info["email"]
        name = user_info["name"] or email.split("@")[0]
        
        user, created = User.objects.get_or_create(email=email, defaults={
            "username": email.split("@")[0] if not User.objects.filter(username=email.split("@")[0]).exists() else f"{email.split('@')[0]}_{secrets.token_hex(4)}",
            "first_name": name,
        })
        if created:
            user.set_unusable_password()
            user.save()
            auth_logger.info(f"New user created via Google OAuth: '{user.username}'")

        tokens = get_tokens_for_user(user)
        auth_logger.info(f"User '{user.username}' logged in via Google OAuth")
        return Response({
            "tokens": tokens,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        })

class FacebookLoginView(APIView):
    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

        user_info = verify_facebook_token(token)
        if not user_info or not user_info.get("email"):
            return Response({"error": "Invalid Facebook token"}, status=status.HTTP_400_BAD_REQUEST)

        email = user_info["email"]
        name = user_info["name"] or email.split("@")[0]
        
        user, created = User.objects.get_or_create(email=email, defaults={
            "username": email.split("@")[0] if not User.objects.filter(username=email.split("@")[0]).exists() else f"{email.split('@')[0]}_{secrets.token_hex(4)}",
            "first_name": name,
        })
        if created:
            user.set_unusable_password()
            user.save()
            auth_logger.info(f"New user created via Facebook OAuth: '{user.username}'")

        tokens = get_tokens_for_user(user)
        auth_logger.info(f"User '{user.username}' logged in via Facebook OAuth")
        return Response({
            "tokens": tokens,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        })

class ChannelProfileView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "Channel not found"}, status=status.HTTP_404_NOT_FOUND)

        is_subscribed = False
        if request.user and request.user.is_authenticated:
            from subscriptions.models import Subscription
            is_subscribed = Subscription.objects.filter(user=request.user, channel=user).exists()

        return Response({
            "id": user.id,
            "username": user.username,
            "name": user.first_name or user.username,
            "profile_pic": user.profile_pic.url if user.profile_pic else None,
            "banner_image": user.banner_image.url if user.banner_image else None,
            "bio": user.bio,
            "subscribers_count": user.subscribers.count(),
            "videos_count": user.video_set.count(),
            "is_subscribed": is_subscribed,
        })

from videos.models import Video
from videos.serializers import VideoSerializer

class ChannelVideosListView(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = []

    def get_queryset(self):
        username = self.kwargs["username"]
        return Video.objects.filter(user__username=username).order_by("-created_at")

from playlists.models import Playlist
from playlists.serializers import PlaylistSerializer

class ChannelPlaylistsListView(generics.ListAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = []

    def get_queryset(self):
        username = self.kwargs["username"]
        queryset = Playlist.objects.filter(user__username=username)
        if self.request.user.is_authenticated and self.request.user.username == username:
            return queryset.order_by("-updated_at")
        return queryset.filter(is_private=False).order_by("-updated_at")

class SearchChannelsView(APIView):
    permission_classes = []
    
    def get(self, request):
        query = request.GET.get("search", "")
        if not query:
            return Response([])
        users = User.objects.filter(username__icontains=query)
        data = []
        for user in users:
            data.append({
                "id": user.id,
                "username": user.username,
                "name": user.first_name or user.username,
                "profile_pic": user.profile_pic.url if user.profile_pic else None,
                "banner_image": user.banner_image.url if user.banner_image else None,
                "bio": user.bio,
                "subscribers_count": user.subscribers.count(),
                "videos_count": user.video_set.count(),
            })
        return Response(data)

from django.db.models import Sum
from videos.models import Video
from comments.models import Comment
from reports.models import Report
from rest_framework import permissions

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        total_videos = Video.objects.count()
        total_views = Video.objects.aggregate(Sum("views"))["views__sum"] or 0
        total_reports = Report.objects.count()

        return Response({
            "total_users": total_users,
            "total_videos": total_videos,
            "total_views": total_views,
            "total_reports": total_reports,
        })

class AdminUserListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        users = User.objects.all().order_by("-date_joined")
        data = [{
            "id": u.id,
            "name": u.username,
            "email": u.email,
            "is_active": u.is_active,
            "banned": not u.is_active,
        } for u in users]
        return Response(data)

class AdminUserBanToggleView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if user == request.user:
            return Response({"error": "You cannot ban yourself"}, status=status.HTTP_400_BAD_REQUEST)

        user.is_active = not user.is_active
        user.save()
        return Response({
            "id": user.id,
            "username": user.username,
            "is_active": user.is_active,
            "banned": not user.is_active,
        })
=======
from django.shortcuts import render

# Create your views here.
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
