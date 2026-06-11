from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    profile_pic = models.ImageField(
        upload_to="profile_pics/",
        blank=True,
        null=True
    )

    banner_image = models.ImageField(
        upload_to="banners/",
        blank=True,
        null=True
    )

    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

from django.utils import timezone
import secrets

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="password_reset_tokens")
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() > self.created_at + timezone.timedelta(minutes=15)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(32)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Reset Token for {self.user.username} (used={self.is_used})"