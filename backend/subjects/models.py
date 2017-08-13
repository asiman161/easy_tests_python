from django.conf import settings
from django.db import models


class Subject(models.Model):
    name = models.CharField(max_length=150)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
