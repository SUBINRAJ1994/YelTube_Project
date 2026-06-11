<<<<<<< HEAD
from django.urls import path, include
from users.views import (
    ChannelProfileView,
    ChannelVideosListView,
    ChannelPlaylistsListView,
    AdminStatsView,
    AdminUserListView,
    AdminUserBanToggleView,
)
from videos.views import AdminVideoListView, AdminVideoDeleteView

urlpatterns = [
    path("api/users/", include("users.urls")),
    path("api/videos/", include("videos.urls")),
    path("api/comments/", include("comments.urls")),
    path("api/subscriptions/", include("subscriptions.urls")),
    path("api/watchlater/", include("watchlater.urls")),
    path("api/history/", include("history.urls")),
    path("api/studio/", include("studio.urls")),
    path("api/playlists/", include("playlists.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/reports/", include("reports.urls")),
    path("api/channel/<str:username>/", ChannelProfileView.as_view(), name="channel-profile-direct"),
    path("api/channel/<str:username>/videos/", ChannelVideosListView.as_view(), name="channel-videos-direct"),
    path("api/channel/<str:username>/playlists/", ChannelPlaylistsListView.as_view(), name="channel-playlists-direct"),
    path("api/admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("api/admin/users/", AdminUserListView.as_view(), name="admin-users"),
    path("api/admin/users/<int:pk>/ban/", AdminUserBanToggleView.as_view(), name="admin-user-ban"),
    path("api/admin/videos/", AdminVideoListView.as_view(), name="admin-videos"),
    path("api/admin/videos/<int:pk>/", AdminVideoDeleteView.as_view(), name="admin-video-delete"),
]
=======
"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
