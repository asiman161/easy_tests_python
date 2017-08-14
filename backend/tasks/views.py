from rest_framework.generics import CreateAPIView, ListAPIView, DestroyAPIView, UpdateAPIView

from subjects.models import Subject
from subjects.serializers import SubjectTasksSerializer, TaskSimpleSerializer
from users.permissions import IsOwner
from .models import Task
from .serializers import CreateUpdateTaskSerializer


class TaskCreateAPIView(CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = CreateUpdateTaskSerializer

    def perform_create(self, serializers):
        task = serializers.save(user=self.request.user)
        subject = Subject.objects.get(user=self.request.user,
                                      id=self.request.data['subject_id'])
        subject.tasks.add(task.id)


class TaskTeacherListAPIView(ListAPIView):
    serializer_class = SubjectTasksSerializer

    def get_queryset(self, *args, **kwargs):
        q = Subject.objects.filter(user=self.request.user)
        return Subject.objects.filter(user=self.request.user)


class TaskUpdateAPIView(UpdateAPIView):
    permission_classes = [IsOwner]
    queryset = Task.objects.all()
    serializer_class = CreateUpdateTaskSerializer
    lookup_field = 'id'

    def perform_update(self, serializer):
        serializer.save()


class TaskDestroyAPIView(DestroyAPIView):
    permission_classes = [IsOwner]
    serializer_class = TaskSimpleSerializer
    queryset = Task.objects.all()
    lookup_field = 'id'

