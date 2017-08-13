from django.conf import settings
from django.db import models


class Feedback(models.Model):
    description = models.CharField(max_length=150)
    text = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.description
