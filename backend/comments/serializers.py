from rest_framework import serializers
from .models import Comment

class CommentSerializer(
    serializers.ModelSerializer
):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )
    user_avatar = serializers.ImageField(
        source="user.profile_pic",
        read_only=True
    )
    video_title = serializers.CharField(
        source="video.title",
        read_only=True
    )

    class Meta:
        model = Comment
        fields = "__all__"