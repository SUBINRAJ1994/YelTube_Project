from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics
from users.models import User
from .models import Subscription
from .serializers import SubscriptionSerializer

class SubscriptionToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        channel_id = request.data.get("channel_id")
        if not channel_id:
            return Response({"error": "channel_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            channel = User.objects.get(pk=channel_id)
        except User.DoesNotExist:
            return Response({"error": "Channel not found"}, status=status.HTTP_404_NOT_FOUND)

        if channel == request.user:
            return Response({"error": "You cannot subscribe to your own channel"}, status=status.HTTP_400_BAD_REQUEST)

        subscription = Subscription.objects.filter(user=request.user, channel=channel).first()
        if subscription:
            subscription.delete()
            is_subscribed = False
        else:
            Subscription.objects.create(user=request.user, channel=channel)
            is_subscribed = True
            
            # Send notification
            from notifications.models import Notification
            Notification.objects.create(
                sender=request.user,
                receiver=channel,
                notification_type="subscription",
                message=f"{request.user.username} subscribed to your channel!"
            )

        subscriber_count = channel.subscribers.count()
        return Response({
            "is_subscribed": is_subscribed,
            "subscriber_count": subscriber_count
        })

class SubscriptionStatusView(APIView):
    def get(self, request, channel_id):
        try:
            channel = User.objects.get(pk=channel_id)
        except User.DoesNotExist:
            return Response({"error": "Channel not found"}, status=status.HTTP_404_NOT_FOUND)

        is_subscribed = False
        if request.user and request.user.is_authenticated:
            is_subscribed = Subscription.objects.filter(user=request.user, channel=channel).exists()

        subscriber_count = channel.subscribers.count()
        return Response({
            "is_subscribed": is_subscribed,
            "subscriber_count": subscriber_count
        })

class SubscriptionListView(generics.ListAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user).order_by("-created_at")
