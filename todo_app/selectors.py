from django.db.models import QuerySet
from django.contrib.auth.models import User
from django.utils import timezone
from .models import Task

def get_active_tasks(user: User) -> QuerySet[Task]:
    """Returns active (uncompleted) tasks for the user that are not overdue."""
    return Task.objects.filter(
        completed=False, 
        deadline__gte=timezone.now(), 
        user=user
    )

def get_completed_tasks(user: User) -> QuerySet[Task]:
    """Returns completed tasks for the user."""
    return Task.objects.filter(completed=True, user=user)

def get_overdue_tasks(user: User) -> QuerySet[Task]:
    """Returns overdue uncompleted tasks for the user."""
    return Task.objects.filter(
        deadline__lt=timezone.now(), 
        completed=False,
        user=user
    )

def get_shared_tasks(user: User) -> QuerySet[Task]:
    """Returns tasks shared with the user."""
    return Task.objects.filter(shared_with=user).distinct()

def get_task_for_user(task_id: int, user: User) -> Task:
    """Returns a specific task ensuring it belongs to the user."""
    # Note: This mimics get_object_or_404(Task, id=task_id, user=user) logic but returns query/object
    # We'll let the view handle 404 usually, but here we return the queryset or object.
    # For selector pattern, usually we return QuerySet or None, or let view handle exception.
    # We will stick to basic filters here.
    return Task.objects.get(id=task_id, user=user)

