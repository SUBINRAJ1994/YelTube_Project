from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.username", read_only=True)
    sender_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ["id", "sender", "sender_name", "sender_avatar", "receiver", "notification_type", "message", "is_read", "created_at"]
        read_only_fields = ["sender", "receiver", "created_at"]

    def get_sender_avatar(self, obj):
        if obj.sender and obj.sender.profile_pic:
            return obj.sender.profile_pic.url
        return None
