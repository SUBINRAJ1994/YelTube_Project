<<<<<<< HEAD
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import History
from .serializers import HistorySerializer
from videos.models import Video

class HistoryListView(generics.ListAPIView):
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return History.objects.filter(user=self.request.user).order_by("-watched_at")

class HistorySaveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        video_id = request.data.get("video_id")
        if not video_id:
            return Response({"error": "video_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            video = Video.objects.get(pk=video_id)
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get or create. If it exists, call save() to update auto_now watched_at field.
        history_item, created = History.objects.get_or_create(
            user=request.user,
            video=video
        )
        if not created:
            history_item.save()

        return Response({"status": "History updated", "watched_at": history_item.watched_at})

class HistoryClearView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        History.objects.filter(user=request.user).delete()
        return Response({"status": "History cleared successfully"})

class HistoryDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = HistorySerializer

    def get_queryset(self):
        return History.objects.filter(user=self.request.user)
=======
from django.shortcuts import render

# Create your views here.
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
