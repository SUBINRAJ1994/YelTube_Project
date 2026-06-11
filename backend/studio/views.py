<<<<<<< HEAD
import os
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from django.db.models import Sum
from videos.models import Video
from videos.serializers import VideoSerializer
from comments.models import Comment
from .serializers import StudioProfileSerializer

from rest_framework.pagination import PageNumberPagination

class StudioVideoPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

class StudioVideoListView(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ["title", "description"]
    pagination_class = StudioVideoPagination

    def get_queryset(self):
        return Video.objects.filter(user=self.request.user).order_by("-created_at")

class StudioAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_videos = Video.objects.filter(user=user)
        
        total_videos = user_videos.count()
        total_views = user_videos.aggregate(Sum("views"))["views__sum"] or 0
        total_likes = user_videos.aggregate(Sum("likes"))["likes__sum"] or 0
        
        # Count comments on user's videos
        total_comments = Comment.objects.filter(video__user=user).count()
        
        # Subscribers count
        total_subscribers = user.subscribers.count()

        return Response({
            "total_videos": total_videos,
            "total_views": total_views,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "total_subscribers": total_subscribers,
        })

class StudioVideoDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Video.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        # Remove video and thumbnail files from disk
        if instance.video_file and hasattr(instance.video_file, 'path') and os.path.exists(instance.video_file.path):
            try:
                os.remove(instance.video_file.path)
            except Exception:
                pass
        if instance.thumbnail and hasattr(instance.thumbnail, 'path') and os.path.exists(instance.thumbnail.path):
            try:
                os.remove(instance.thumbnail.path)
            except Exception:
                pass
        
        # Delete resolution files as well
        for res_file in instance.resolution_files.all():
            if res_file.file and hasattr(res_file.file, 'path') and os.path.exists(res_file.file.path):
                try:
                    os.remove(res_file.file.path)
                except Exception:
                    pass
        
        instance.delete()

class StudioProfileUpdateView(generics.UpdateAPIView):
    serializer_class = StudioProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
=======
from django.shortcuts import render

# Create your views here.
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
