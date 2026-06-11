from rest_framework import generics, permissions, status
from .models import Report, ReportReason
from .serializers import ReportSerializer, ReportReasonSerializer

class ReportReasonListView(generics.ListAPIView):
    queryset = ReportReason.objects.all()
    serializer_class = ReportReasonSerializer
    permission_classes = [permissions.AllowAny]

class ReportCreateView(generics.CreateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

class ReportListView(generics.ListAPIView):
    queryset = Report.objects.all().order_by("-created_at")
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAdminUser]

class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAdminUser]
