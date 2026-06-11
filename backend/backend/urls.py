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