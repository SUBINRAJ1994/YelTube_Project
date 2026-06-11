from urllib.parse import quote
from rest_framework import serializers
from .models import Video, VideoReaction

class VideoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    user_avatar = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = "__all__"

    def validate_video_file(self, value):
        if value:
            ext = value.name.split(".")[-1].lower()
            if ext not in ["mp4", "mkv"]:
                raise serializers.ValidationError("Only MP4 and MKV formats are allowed.")
            if value.size > 50 * 1024 * 1024:
                raise serializers.ValidationError("File size must not exceed 50MB.")
        return value

    def validate_thumbnail(self, value):
        if value:
            ext = value.name.split(".")[-1].lower()
            if ext not in ["jpg", "jpeg", "png", "webp"]:
                raise serializers.ValidationError("Only JPEG, PNG, and WEBP formats are allowed for thumbnails.")
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Thumbnail size must not exceed 5MB.")
        return value


    def get_user_avatar(self, obj):
        if obj.user.profile_pic:
            return obj.user.profile_pic.url
        return f"https://ui-avatars.com/api/?name={quote(obj.user.username)}&background=random&color=fff"

    def get_user_reaction(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            reaction = VideoReaction.objects.filter(user=request.user, video=obj).first()
            if reaction:
                return reaction.reaction_type
        return None

class VideoReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoReaction
        fields = "__all__"