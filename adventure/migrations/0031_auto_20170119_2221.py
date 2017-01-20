# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-01-20 06:21
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adventure', '0030_adventure_full_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='adventure',
            name='intro_question',
            field=models.TextField(blank=True, default='', help_text='If you want to ask the adventurer a question when they start the adventure, put the question text here. The answer will be available in the game object.'),
        ),
        migrations.AlterField(
            model_name='adventure',
            name='intro_text',
            field=models.TextField(blank=True, default='', help_text='Text shown to the adventurer when they begin the adventure. Use this to set up the story.'),
        ),
    ]
