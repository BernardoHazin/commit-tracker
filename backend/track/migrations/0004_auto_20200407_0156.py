# Generated by Django 2.2.12 on 2020-04-07 01:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('track', '0003_commit_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='commit',
            name='date',
            field=models.DateTimeField(),
        ),
    ]
