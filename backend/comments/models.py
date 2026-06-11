from django.db import models
<<<<<<< HEAD
from users.models import User
from videos.models import Video

class Comment(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    video = models.ForeignKey(
        Video,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    text = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.user.username
=======

# Create your models here.
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
