from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('tasks/', views.task_list, name='task_list'),
    path('overdue/', views.overdue_tasks_view, name='overdue_tasks'),
    path('completed/', views.completed_tasks, name='completed_tasks'),
    path('add/', views.add_task, name='add_task'),
    path('task/<int:task_id>/', views.task_detail, name='task_detail'),
    path('task/<int:task_id>/complete/', views.mark_task_as_completed, name='mark_task_as_completed'),
    path('delete/<int:task_id>/', views.delete_task, name='delete_task'),
    path('settings/', views.settings_view, name='settings'),
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('task/<int:task_id>/edit/', views.edit_task, name='edit_task'),
    path('shared/', views.shared_tasks, name='shared_tasks'),
    path('task/<int:task_id>/share/', views.share_task, name='share_task'),
]