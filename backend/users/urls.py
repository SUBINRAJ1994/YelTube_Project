from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    RegisterView,
    ProfileView,
    ForgotPasswordView,
    ResetPasswordView,
    GoogleLoginView,
    FacebookLoginView,
    ChannelProfileView,
    ChannelVideosListView,
    ChannelPlaylistsListView,
    SearchChannelsView,
    CustomTokenObtainPairView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("search/", SearchChannelsView.as_view(), name="search-channels"),
    path("channel/<str:username>/", ChannelProfileView.as_view(), name="channel-profile"),
    path("channel/<str:username>/videos/", ChannelVideosListView.as_view(), name="channel-videos"),
    path("channel/<str:username>/playlists/", ChannelPlaylistsListView.as_view(), name="channel-playlists"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("google-login/", GoogleLoginView.as_view(), name="google-login"),
    path("facebook-login/", FacebookLoginView.as_view(), name="facebook-login"),
]