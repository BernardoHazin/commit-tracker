# Generated by Django 2.2.12 on 2020-04-07 01:56

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('track', '0002_auto_20200407_0145'),
    ]

    operations = [
        migrations.AddField(
            model_name='commit',
            name='date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]