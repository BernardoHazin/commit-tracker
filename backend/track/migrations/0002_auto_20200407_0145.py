# Generated by Django 2.2.12 on 2020-04-07 01:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('track', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='commit',
            old_name='commiter',
            new_name='committer',
        ),
        migrations.AddField(
            model_name='commit',
            name='sha',
            field=models.CharField(default='', max_length=40),
        ),
    ]