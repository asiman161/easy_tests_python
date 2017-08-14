from django.conf import settings
from django.contrib.postgres.fields import JSONField
from django.db import models


class Task(models.Model):
    name = models.CharField(max_length=150)
    data = JSONField()
    answers = JSONField()
    time = models.PositiveSmallIntegerField(blank=True, null=True)
    time_end = models.DateTimeField(blank=True, null=True)
    show_task = models.BooleanField(default=False)
    random_variant = models.BooleanField(default=False)
    variants_count = models.PositiveSmallIntegerField(default=0)
    task_type = models.PositiveSmallIntegerField(default=0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
