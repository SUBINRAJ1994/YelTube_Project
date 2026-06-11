from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class StudioProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "profile_pic", "banner_image", "bio"]
        read_only_fields = ["id", "username", "email"]

    def validate_profile_pic(self, value):
        if value:
            ext = value.name.split(".")[-1].lower()
            if ext not in ["jpg", "jpeg", "png", "webp"]:
                raise serializers.ValidationError("Only JPEG, PNG, and WEBP formats are allowed for profile pictures.")
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Profile picture size must not exceed 5MB.")
        return value

    def validate_banner_image(self, value):
        if value:
            ext = value.name.split(".")[-1].lower()
            if ext not in ["jpg", "jpeg", "png", "webp"]:
                raise serializers.ValidationError("Only JPEG, PNG, and WEBP formats are allowed for banner images.")
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Banner image size must not exceed 5MB.")
        return value

