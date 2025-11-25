from django.urls import path
from tasks.views import auth, tasks, settings

urlpatterns = [
    path('', tasks.index, name='index'),
    path('tasks/', tasks.task_list, name='task_list'),
    path('overdue/', tasks.overdue_tasks_view, name='overdue_tasks'),
    path('completed/', tasks.completed_tasks, name='completed_tasks'),
    path('add/', tasks.add_task, name='add_task'),
    path('task/<int:task_id>/', tasks.task_detail, name='task_detail'),
    path('task/<int:task_id>/complete/', tasks.mark_task_as_completed, name='mark_task_as_completed'),
    path('delete/<int:task_id>/', tasks.delete_task, name='delete_task'),
    path('settings/', settings.settings_view, name='settings'),
    path('settings/delete-account/', settings.delete_account, name='delete_account'),
    path('register/', auth.register, name='register'),
    path('login/', auth.user_login, name='login'),
    path('logout/', auth.user_logout, name='logout'),
    path('task/<int:task_id>/edit/', tasks.edit_task, name='edit_task'),
    path('shared/', tasks.shared_tasks, name='shared_tasks'),
    path('task/<int:task_id>/share/', tasks.share_task, name='share_task'),
]
