
from django.conf import settings
from django.contrib.postgres.fields import JSONField
from django.db import models

from groups.models import Group
from tasks.models import Task


class CompletedTask(models.Model):
    answers = JSONField()
    rate = models.CharField(max_length=15, default=-1)
    first_complete = models.BooleanField(default=False)
    task_type = models.PositiveSmallIntegerField(default=0)
    variant = models.PositiveSmallIntegerField(default=0)
    time = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    group = models.ForeignKey(Group)
    task = models.ForeignKey(Task)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user
