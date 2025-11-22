from django.contrib.auth.models import User
from django.utils import timezone
from .models import Task

def mark_task_completed(task: Task) -> Task:
    """Marks a task as completed."""
    task.completed = True
    task.completed_at = timezone.now()
    task.save()
    return task

def toggle_task_share(task: Task, user: User) -> bool:
    """
    Toggles share status for a user on a task.
    Returns True if shared, False if unshared.
    """
    is_shared = task.shared_with.filter(id=user.id).exists()
    if is_shared:
        task.shared_with.remove(user)
        return False
    else:
        task.shared_with.add(user)
        return True

