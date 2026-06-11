import os
import threading
from django.core.files.base import ContentFile
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Video, VideoResolutionFile
from .serializers import VideoSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from .ffmpeg_utils import extract_video_metadata, extract_thumbnail, transcode_video

def process_video_in_background(video_id):
    try:
        video = Video.objects.get(pk=video_id)
    except Video.DoesNotExist:
        return
        
    video_path = video.video_file.path
    media_dir = os.path.dirname(video_path)
    base_name = os.path.splitext(os.path.basename(video_path))[0]
    
    # 1. Extract metadata
    metadata = extract_video_metadata(video_path)
    video.duration = metadata.get("duration")
    video.resolution = metadata.get("resolution")
    video.file_size = metadata.get("file_size")
    video.save()
    
    # 2. Extract thumbnail if not manually provided
    if not video.thumbnail:
        thumb_name = f"{base_name}_thumb.jpg"
        thumb_dir = os.path.join(os.path.dirname(media_dir), "thumbnails")
        os.makedirs(thumb_dir, exist_ok=True)
        thumb_path = os.path.join(thumb_dir, thumb_name)
        
        if extract_thumbnail(video_path, thumb_path):
            with open(thumb_path, "rb") as f:
                video.thumbnail.save(thumb_name, ContentFile(f.read()), save=True)
    
    # 3. Transcode to 480p, 720p, 1080p based on original height
    original_height = metadata.get("height") or 0
    target_resolutions = [480, 720, 1080]
    
    for height in target_resolutions:
        if original_height and height > original_height:
            continue
            
        res_name = f"{base_name}_{height}p.mp4"
        processed_dir = os.path.join(os.path.dirname(media_dir), "processed_videos")
        os.makedirs(processed_dir, exist_ok=True)
        res_path = os.path.join(processed_dir, res_name)
        
        if transcode_video(video_path, res_path, height):
            with open(res_path, "rb") as f:
                res_file = VideoResolutionFile(
                    video=video,
                    resolution=f"{height}p"
                )
                res_file.file.save(res_name, ContentFile(f.read()), save=True)

class VideoUploadView(
    generics.CreateAPIView
):

    serializer_class = VideoSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def perform_create(
        self,
        serializer
    ):
        video = serializer.save(
            user=self.request.user
        )
        # Trigger background processing
        thread = threading.Thread(
            target=process_video_in_background,
            args=(video.id,)
        )
        thread.daemon = True
        thread.start()

        # Send notification to all subscribers of the creator
        try:
            from notifications.models import Notification
            subscribers = video.user.subscribers.all()
            notifications = [
                Notification(
                    sender=video.user,
                    receiver=sub.user,
                    notification_type="upload",
                    message=f"{video.user.username} uploaded a new video: \"{video.title}\""
                )
                for sub in subscribers
            ]
            Notification.objects.bulk_create(notifications)
        except Exception as e:
            print(f"Error dispatching upload notifications: {e}")

class VideoListView(
    generics.ListAPIView
):
    queryset = Video.objects.all().order_by("-created_at")
    serializer_class = VideoSerializer

class VideoDetailView(
    generics.RetrieveAPIView
):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

class SearchVideoView(generics.ListAPIView):
    serializer_class = VideoSerializer

    def get_queryset(self):
        query = self.request.GET.get("search", "")
        return Video.objects.filter(title__icontains=query)

class RelatedVideosView(APIView):

    def get(
        self,
        request,
        pk
    ):

        video = Video.objects.get(id=pk)

        related = Video.objects.filter(
            category=video.category
        ).exclude(
            id=pk
        )[:10]

        serializer = VideoSerializer(
            related,
            many=True
        )

        return Response(
            serializer.data
        )

class VideoReactionToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        from rest_framework import status
        from .models import VideoReaction
        
        try:
            video = Video.objects.get(pk=pk)
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, status=status.HTTP_404_NOT_FOUND)

        reaction_type = request.data.get("reaction_type")
        if reaction_type not in ["like", "dislike"]:
            return Response({"error": "Invalid reaction type"}, status=status.HTTP_400_BAD_REQUEST)

        # Check and set reaction
        reaction, created = VideoReaction.objects.get_or_create(
            user=request.user,
            video=video,
            defaults={"reaction_type": reaction_type}
        )

        if not created:
            if reaction.reaction_type == reaction_type:
                reaction.delete()
                user_reaction = None
            else:
                reaction.reaction_type = reaction_type
                reaction.save()
                user_reaction = reaction_type
        else:
            user_reaction = reaction_type

        # Re-sync likes and dislikes count
        video.likes = VideoReaction.objects.filter(video=video, reaction_type="like").count()
        video.dislikes = VideoReaction.objects.filter(video=video, reaction_type="dislike").count()
        video.save()

        return Response({
            "likes": video.likes,
            "dislikes": video.dislikes,
            "user_reaction": user_reaction
        })
