# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-04-03 04:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adventure', '0011_auto_20160327_2346'),
    ]

    operations = [
        migrations.AddField(
            model_name='adventure',
            name='edx_program_file',
            field=models.CharField(max_length=50, null=True),
        ),
    ]