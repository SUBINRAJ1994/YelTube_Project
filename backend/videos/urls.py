from django.urls import path
from .views import (
    VideoUploadView,
    VideoListView,
    VideoDetailView,
    SearchVideoView,
    RelatedVideosView,
    VideoReactionToggleView,
)

urlpatterns = [
    path("", VideoListView.as_view(), name="video-list"),
    path("upload/", VideoUploadView.as_view(), name="video-upload"),
    path("search/", SearchVideoView.as_view(), name="video-search"),
    path("<int:pk>/", VideoDetailView.as_view(), name="video-detail"),
    path("related/<int:pk>/", RelatedVideosView.as_view(), name="related-videos"),
    path("<int:pk>/reaction/", VideoReactionToggleView.as_view(), name="video-reaction"),
]