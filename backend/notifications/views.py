<<<<<<< HEAD
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user).order_by("-created_at")

class NotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk=None):
        if pk:
            notification = get_object_or_404(Notification, pk=pk, receiver=request.user)
            notification.is_read = True
            notification.save()
            return Response({"status": "Notification marked as read"})
        else:
            Notification.objects.filter(receiver=request.user, is_read=False).update(is_read=True)
            return Response({"status": "All notifications marked as read"})

class NotificationDeleteView(generics.DestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user)
=======
from django.shortcuts import render

# Create your views here.
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
