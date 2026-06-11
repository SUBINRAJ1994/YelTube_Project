from django.urls import path
from .views import (
    SubscriptionToggleView,
    SubscriptionStatusView,
    SubscriptionListView,
)

urlpatterns = [
    path("", SubscriptionListView.as_view(), name="subscription-list"),
    path("toggle/", SubscriptionToggleView.as_view(), name="subscription-toggle"),
    path("status/<int:channel_id>/", SubscriptionStatusView.as_view(), name="subscription-status"),
]
