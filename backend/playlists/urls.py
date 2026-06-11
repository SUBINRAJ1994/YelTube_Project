from django.urls import path
from .views import (
    PlaylistListCreateView,
    PlaylistDetailView,
    PlaylistVideoAddView,
    PlaylistVideoRemoveView,
    SearchPlaylistsView,
)

urlpatterns = [
    path("", PlaylistListCreateView.as_view(), name="playlist-list-create"),
    path("search/", SearchPlaylistsView.as_view(), name="playlists-search"),
    path("<int:pk>/", PlaylistDetailView.as_view(), name="playlist-detail"),
    path("<int:playlist_id>/video/", PlaylistVideoAddView.as_view(), name="playlist-video-add"),
    path("<int:playlist_id>/video/<int:video_id>/", PlaylistVideoRemoveView.as_view(), name="playlist-video-remove"),
]
