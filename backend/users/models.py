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