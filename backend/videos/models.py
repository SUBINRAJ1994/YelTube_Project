from django.db import models
from users.models import User

class Video(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    title = models.CharField(
        max_length=255
    )

    description = models.TextField()

    category = models.CharField(
        max_length=100
    )

    video_file = models.FileField(
        upload_to="videos/"
    )

    thumbnail = models.ImageField(
        upload_to="thumbnails/"
    )

    views = models.IntegerField(
        default=0
    )

    likes = models.IntegerField(
        default=0
    )

    dislikes = models.IntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    duration = models.FloatField(null=True, blank=True)
    resolution = models.CharField(max_length=50, null=True, blank=True)
    file_size = models.BigIntegerField(null=True, blank=True)
    moderation_status = models.CharField(
        max_length=20,
        choices=(
            ("pending", "Pending"),
            ("allowed", "Allowed"),
            ("flagged", "Flagged"),
            ("rejected", "Rejected"),
            ("manual_review", "Manual Review"),
        ),
        default="pending"
    )
    moderation_report = models.TextField(blank=True, default="{}")

    def __str__(self):
        return self.title

class VideoResolutionFile(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name="resolution_files")
    resolution = models.CharField(max_length=10) # "1080p", "720p", "480p"
    file = models.FileField(upload_to="processed_videos/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.video.title} - {self.resolution}"

class VideoReaction(models.Model):
    REACTION_CHOICES = (
        ("like", "Like"),
        ("dislike", "Dislike"),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reactions")
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name="reactions")
    reaction_type = models.CharField(max_length=10, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "video")

    def __str__(self):
        return f"{self.user.username} - {self.video.title} - {self.reaction_type}"