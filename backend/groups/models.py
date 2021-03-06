import random
import string

from django.conf import settings
from django.db import models


def generate_key():
    return ''.join([random.choice(string.ascii_lowercase + string.digits) for n in range(10)])


class Group(models.Model):
    name = models.CharField(max_length=50)
    group_age = models.PositiveSmallIntegerField(default=1)
    key = models.CharField(db_index=True, max_length=15, default=generate_key)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
