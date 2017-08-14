from rest_framework import serializers

from .models import Task


class TaskSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            'id',
            'name',
            'show_task',
        )


class CreateUpdateTaskSerializer(serializers.ModelSerializer):
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
        )
