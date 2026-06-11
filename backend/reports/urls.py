from django.urls import path
from .views import (
    ReportReasonListView,
    ReportCreateView,
    ReportListView,
    ReportDetailView,
)

urlpatterns = [
    path("", ReportListView.as_view(), name="report-list"),
    path("reasons/", ReportReasonListView.as_view(), name="report-reasons-list"),
    path("add/", ReportCreateView.as_view(), name="report-create"),
    path("<int:pk>/", ReportDetailView.as_view(), name="report-detail"),
]
