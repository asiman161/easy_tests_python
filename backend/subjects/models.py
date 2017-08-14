from django.conf import settings
from django.db import models

from tasks.models import Task


class Subject(models.Model):
    name = models.CharField(max_length=150)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    tasks = models.ManyToManyField(Task)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
