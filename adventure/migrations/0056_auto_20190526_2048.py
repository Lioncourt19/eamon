# Generated by Django 2.2.1 on 2019-05-27 03:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adventure', '0055_auto_20190522_2239'),
    ]

    operations = [
        migrations.AddField(
            model_name='artifact',
            name='is_markdown',
            field=models.BooleanField(choices=[(0, 'Plain text'), (1, 'Markdown')], default=0),
        ),
        migrations.AddField(
            model_name='effect',
            name='is_markdown',
            field=models.BooleanField(choices=[(0, 'Plain text'), (1, 'Markdown')], default=0),
        ),
        migrations.AddField(
            model_name='monster',
            name='is_markdown',
            field=models.BooleanField(choices=[(0, 'Plain text'), (1, 'Markdown')], default=0),
        ),
        migrations.AddField(
            model_name='room',
            name='is_markdown',
            field=models.BooleanField(default=0),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='description',
            field=models.TextField(max_length=1000),
        ),
        migrations.AlterField(
            model_name='effect',
            name='text',
            field=models.TextField(max_length=65535),
        ),
        migrations.AlterField(
            model_name='monster',
            name='description',
            field=models.TextField(max_length=1000),
        ),
    ]