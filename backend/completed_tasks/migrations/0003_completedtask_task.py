# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-14 14:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tasks', '0001_initial'),
        ('completed_tasks', '0002_completedtask_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='completedtask',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tasks.Task'),
        ),
    ]
