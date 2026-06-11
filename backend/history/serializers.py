from rest_framework import serializers
from .models import History
from videos.serializers import VideoSerializer

class HistorySerializer(serializers.ModelSerializer):
    video_details = VideoSerializer(source="video", read_only=True)

    class Meta:
        model = History
        fields = ["id", "video", "watched_at", "video_details"]
        read_only_fields = ["user"]
