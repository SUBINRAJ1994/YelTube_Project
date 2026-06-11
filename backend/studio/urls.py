from django.urls import path
from .views import (
    StudioVideoListView,
    StudioAnalyticsView,
    StudioVideoDetailUpdateDeleteView,
    StudioProfileUpdateView,
)

urlpatterns = [
    path("videos/", StudioVideoListView.as_view(), name="studio-videos"),
    path("analytics/", StudioAnalyticsView.as_view(), name="studio-analytics"),
    path("video/<int:pk>/", StudioVideoDetailUpdateDeleteView.as_view(), name="studio-video-detail"),
    path("profile/", StudioProfileUpdateView.as_view(), name="studio-profile-update"),
]
