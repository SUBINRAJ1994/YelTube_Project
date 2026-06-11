from django.db import models
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
