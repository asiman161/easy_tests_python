import random
import string

from django.conf import settings
from django.db import models


def generate_key():
    return ''.join([random.choice(string.ascii_lowercase + string.digits) for n in range(10)])


class Group(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    name = models.CharField(max_length=50)
    group_age = models.PositiveSmallIntegerField(default=1)
    key = models.CharField(max_length=15, default=generate_key)

    def __str__(self):
        return self.name
