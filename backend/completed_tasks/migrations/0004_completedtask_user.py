# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-13 14:48
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('completed_tasks', '0003_completedtask_task'),
    ]

    operations = [
        migrations.AddField(
            model_name='completedtask',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]