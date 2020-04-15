from django.db import models

# Create your models here.


class Commit(models.Model):
    sha = models.CharField(max_length=40, default='', unique=True)
    committer = models.CharField(max_length=255)
    message = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    user = models.CharField(max_length=255)
    project = models.CharField(max_length=255)
    date = models.DateTimeField()

    class Meta:
        ordering = ['-date']


class Hooks(models.Model):
    id = models.IntegerField(primary_key=True, null=False)
    project = models.CharField(max_length=255, unique=True)