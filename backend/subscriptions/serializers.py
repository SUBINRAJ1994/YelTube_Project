from rest_framework import serializers
from .models import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    channel_details = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = ["id", "channel", "created_at", "channel_details"]
        read_only_fields = ["user"]

    def get_channel_details(self, obj):
        channel = obj.channel
        return {
            "id": channel.id,
            "username": channel.username,
            "email": channel.email,
            "profile_pic": channel.profile_pic.url if channel.profile_pic else None,
            "bio": channel.bio,
        }
