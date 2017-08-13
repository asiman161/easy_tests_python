from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny

from .models import Subject
from .serializers import SubjectSerializer
from users.permissions import IsOwner


class SubjectListAPIView(ListAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [AllowAny]

    def get_queryset(self, *args, **kwargs):
        queryset_list = Subject.objects.filter(user=self.request.user)
        return queryset_list


class SubjectCreateAPIView(CreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SubjectDetailAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = SubjectSerializer
    lookup_field = 'id'

    def get_queryset(self, *args, **kwargs):
        return Subject.objects.filter(user=self.request.user)
