from rest_framework.generics import CreateAPIView

from .models import Task
from .serializers import CreateTaskSerializer


class TaskCreateAPIView(CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = CreateTaskSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
