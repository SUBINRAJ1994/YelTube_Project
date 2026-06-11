from django.urls import path
from .views import CommentCreateView, VideoCommentsView, CommentDetailView, CreatorCommentsListView

urlpatterns = [
    path("add/", CommentCreateView.as_view(), name="comment-add"),
    path("video/<int:video_id>/", VideoCommentsView.as_view(), name="video-comments"),
    path("creator/", CreatorCommentsListView.as_view(), name="creator-comments"),
    path("<int:pk>/", CommentDetailView.as_view(), name="comment-detail"),
]