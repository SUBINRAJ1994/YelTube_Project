from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

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