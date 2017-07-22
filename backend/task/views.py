from django.shortcuts import render

# Create your views here.
from rest_framework import generics

from task.models import Task
from task.serializers import TaskSerializer


class ListCreateTasks(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
