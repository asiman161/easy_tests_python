from rest_framework import serializers

from tasks.serializers import TaskSimpleSerializer
from .models import Subject


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = (
            'id',
            'name',
        )


class SubjectTasksSerializer(serializers.ModelSerializer):
    tasks = TaskSimpleSerializer(many=True)

    class Meta:
        model = Subject
        fields = (
            'id',
            'name',
            'tasks',
        )
