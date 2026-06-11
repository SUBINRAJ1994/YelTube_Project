from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import WatchLater
from .serializers import WatchLaterSerializer
from videos.models import Video

class WatchLaterListCreateView(generics.ListCreateAPIView):
    serializer_class = WatchLaterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WatchLater.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WatchLaterToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        video_id = request.data.get("video_id")
        if not video_id:
            return Response({"error": "video_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            video = Video.objects.get(pk=video_id)
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, status=status.HTTP_404_NOT_FOUND)

        watch_later_item = WatchLater.objects.filter(user=request.user, video=video).first()
        if watch_later_item:
            watch_later_item.delete()
            added = False
        else:
            WatchLater.objects.create(user=request.user, video=video)
            added = True

        return Response({"added": added})

class WatchLaterDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WatchLaterSerializer

    def get_queryset(self):
        return WatchLater.objects.filter(user=self.request.user)
