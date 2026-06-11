from django.urls import path
from .views import (
    WatchLaterListCreateView,
    WatchLaterToggleView,
    WatchLaterDeleteView,
)

urlpatterns = [
    path("", WatchLaterListCreateView.as_view(), name="watchlater-list-create"),
    path("toggle/", WatchLaterToggleView.as_view(), name="watchlater-toggle"),
    path("<int:pk>/", WatchLaterDeleteView.as_view(), name="watchlater-delete"),
]
