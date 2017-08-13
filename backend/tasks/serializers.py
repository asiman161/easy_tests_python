from rest_framework import serializers

from .models import Task


class CreateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            'name',
            'data',
            'answers',
            'time',
            'show_task',
            'random_variant',
            'variants_count',
            'task_type',
            'subject',
        )

