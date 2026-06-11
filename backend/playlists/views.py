from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import Playlist, PlaylistVideo
from .serializers import PlaylistSerializer, PlaylistVideoSerializer
from videos.models import Video

class PlaylistListCreateView(generics.ListCreateAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Playlist.objects.filter(user=self.request.user).order_by("-updated_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

from permissions import IsOwnerOrReadOnly

class PlaylistDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Playlist.objects.all()

    def retrieve(self, request, *args, **kwargs):
        playlist = self.get_object()
        if playlist.is_private and playlist.user != request.user:
            return Response({"error": "This playlist is private."}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(playlist)
        return Response(serializer.data)


class PlaylistVideoAddView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, playlist_id):
        playlist = get_object_or_404(Playlist, pk=playlist_id, user=request.user)
        video_id = request.data.get("video_id")
        if not video_id:
            return Response({"error": "video_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        video = get_object_or_404(Video, pk=video_id)
        
        playlist_video, created = PlaylistVideo.objects.get_or_create(
            playlist=playlist,
            video=video
        )
        if created:
            playlist_video.order = playlist.playlist_videos.count() - 1
            playlist_video.save()
            return Response({"status": "Video added to playlist"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"status": "Video already in playlist"}, status=status.HTTP_200_OK)

class PlaylistVideoRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, playlist_id, video_id):
        playlist = get_object_or_404(Playlist, pk=playlist_id, user=request.user)
        video = get_object_or_404(Video, pk=video_id)
        
        playlist_video = PlaylistVideo.objects.filter(playlist=playlist, video=video).first()
        if playlist_video:
            playlist_video.delete()
            return Response({"status": "Video removed from playlist"})
        else:
            return Response({"error": "Video not found in playlist"}, status=status.HTTP_404_NOT_FOUND)
