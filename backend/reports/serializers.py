from rest_framework import serializers
from .models import Report, ReportReason

class ReportReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportReason
        fields = "__all__"

class ReportSerializer(serializers.ModelSerializer):
    reporter_name = serializers.CharField(source="reporter.username", read_only=True)
    report_reason_name = serializers.CharField(source="report_reason.name", read_only=True)
    content_details = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            "id",
            "reporter",
            "reporter_name",
            "report_reason",
            "report_reason_name",
            "content_type",
            "object_id",
            "description",
            "status",
            "created_at",
            "updated_at",
            "content_details",
        ]
        read_only_fields = ["reporter", "status", "created_at", "updated_at"]

    def get_content_details(self, obj):
        try:
            if obj.content_type == "video":
                from videos.models import Video
                video = Video.objects.filter(pk=obj.object_id).first()
                if video:
                    return {
                        "title": video.title,
                        "video_id": video.id,
                    }
            elif obj.content_type == "comment":
                from comments.models import Comment
                comment = Comment.objects.filter(pk=obj.object_id).first()
                if comment:
                    return {
                        "text": comment.text,
                        "video_id": comment.video.id,
                        "video_title": comment.video.title,
                    }
        except Exception:
            pass
        return None
