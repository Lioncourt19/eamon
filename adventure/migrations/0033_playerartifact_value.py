# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-01-31 07:08
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adventure', '0032_artifact_armor_penalty'),
    ]

    operations = [
        migrations.AddField(
            model_name='playerartifact',
            name='value',
            field=models.IntegerField(default=0),
        ),
    ]
