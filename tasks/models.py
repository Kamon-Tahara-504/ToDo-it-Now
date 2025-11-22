from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    deadline = models.DateTimeField(null=True, blank=True)
    shared_with = models.ManyToManyField(User, related_name='shared_tasks', blank=True)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  # 作成日時
    updated_at = models.DateTimeField(auto_now=True)      # 更新日時
    color = models.CharField(max_length=50, default='#ffffff')
    shared = models.BooleanField(default=False)

    class Meta:
        ordering = ['deadline']

    def __str__(self):
        return self.title
