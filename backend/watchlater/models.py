from django.db import models
<<<<<<< HEAD
from users.models import User
from videos.models import Video

class WatchLater(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watchlater")
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "video")

    def __str__(self):
        return f"{self.user.username} - Watch Later: {self.video.title}"
=======

# Create your models here.
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
