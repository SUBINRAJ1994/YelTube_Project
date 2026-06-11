from django.db import models
<<<<<<< HEAD
from users.models import User
from videos.models import Video

class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="history")
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    watched_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Histories"

    def __str__(self):
        return f"{self.user.username} watched {self.video.title}"
=======

# Create your models here.
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
