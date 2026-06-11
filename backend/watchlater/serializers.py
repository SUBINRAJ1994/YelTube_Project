from rest_framework import serializers
from .models import WatchLater
from videos.serializers import VideoSerializer

class WatchLaterSerializer(serializers.ModelSerializer):
    video_details = VideoSerializer(source="video", read_only=True)

    class Meta:
        model = WatchLater
        fields = ["id", "video", "created_at", "video_details"]
        read_only_fields = ["user"]
