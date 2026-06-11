from rest_framework import serializers
from .models import Playlist, PlaylistVideo
from videos.serializers import VideoSerializer

class PlaylistVideoSerializer(serializers.ModelSerializer):
    video_details = VideoSerializer(source="video", read_only=True)

    class Meta:
        model = PlaylistVideo
        fields = ["id", "video", "order", "added_at", "video_details"]

class PlaylistSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    videos_count = serializers.SerializerMethodField()
    videos = PlaylistVideoSerializer(source="playlist_videos", many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = ["id", "title", "description", "is_private", "created_at", "updated_at", "username", "videos_count", "videos"]
        read_only_fields = ["user"]

    def get_videos_count(self, obj):
        return obj.playlist_videos.count()
