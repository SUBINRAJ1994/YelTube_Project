from django.urls import path
from .views import CommentCreateView, VideoCommentsView, CommentDetailView

urlpatterns = [
    path("add/", CommentCreateView.as_view(), name="comment-add"),
    path("video/<int:video_id>/", VideoCommentsView.as_view(), name="video-comments"),
    path("<int:pk>/", CommentDetailView.as_view(), name="comment-detail"),
]