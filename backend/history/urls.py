from django.urls import path
from .views import (
    HistoryListView,
    HistorySaveView,
    HistoryClearView,
    HistoryDeleteView,
)

urlpatterns = [
    path("", HistoryListView.as_view(), name="history-list"),
    path("save/", HistorySaveView.as_view(), name="history-save"),
    path("clear/", HistoryClearView.as_view(), name="history-clear"),
    path("<int:pk>/", HistoryDeleteView.as_view(), name="history-delete"),
]
