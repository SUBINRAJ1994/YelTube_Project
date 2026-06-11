<<<<<<< HEAD
from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Comment
from .serializers import CommentSerializer

class CommentCreateView(
    generics.CreateAPIView
):
    serializer_class = CommentSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def perform_create(
        self,
        serializer
    ):
        comment = serializer.save(
            user=self.request.user
        )
        video = comment.video
        if video.user != self.request.user:
            from notifications.models import Notification
            Notification.objects.create(
                sender=self.request.user,
                receiver=video.user,
                notification_type="comment",
                message=f"{self.request.user.username} commented on your video: \"{video.title}\""
            )
from rest_framework.generics import ListAPIView

class VideoCommentsView(
    ListAPIView
):
    serializer_class = CommentSerializer

    def get_queryset(self):

        video_id = self.kwargs["video_id"]

        return Comment.objects.filter(
            video_id=video_id
        ).order_by("-created_at")

from permissions import IsCommentOwnerOrVideoOwnerOrReadOnly

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsCommentOwnerOrVideoOwnerOrReadOnly]

class CreatorCommentsListView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(video__user=self.request.user).order_by("-created_at")
=======
from django.shortcuts import render

# Create your views here.
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
