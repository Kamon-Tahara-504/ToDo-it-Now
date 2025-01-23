from django.utils.timezone import now
from .models import Task

def move_overdue_tasks():
    overdue_tasks = Task.objects.filter(deadline__lt=now(), completed=False)
    for task in overdue_tasks:
        # 必要に応じて通知ロジックを追加
        print(f"Task overdue: {task.title}")
