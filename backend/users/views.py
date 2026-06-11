from rest_framework import generics
# pyrefly: ignore [missing-import]
from .models import User
# pyrefly: ignore [missing-import]
from .serializers import RegisterSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class RegisterView(
    generics.CreateAPIView
):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
class ProfileView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        return Response({
            "username": request.user.username,
            "email": request.user.email
        })
        