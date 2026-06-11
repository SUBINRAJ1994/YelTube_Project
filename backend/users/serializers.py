from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "date_of_birth"
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        if "date_of_birth" in validated_data:
            user.date_of_birth = validated_data["date_of_birth"]
            user.save()
        return user