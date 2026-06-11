from django.urls import path, include

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
]