from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ReportReason(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Report(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("reviewed", "Reviewed"),
        ("action_taken", "Action Taken"),
        ("dismissed", "Dismissed"),
    )
    
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="filed_reports")
    report_reason = models.ForeignKey(ReportReason, on_delete=models.CASCADE, related_name="reports")
    content_type = models.CharField(max_length=20) # "video", "comment", "user"
    object_id = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Report {self.id} by {self.reporter.username} - {self.content_type} ({self.status})"
