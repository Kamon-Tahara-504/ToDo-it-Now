from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.contrib import messages
from django.http import HttpRequest, HttpResponse

from tasks.models import Task
from tasks.forms import TaskForm

def index(request: HttpRequest) -> HttpResponse:
    return redirect('task_list')  # タスク一覧へリダイレクト

def task_list(request: HttpRequest) -> HttpResponse:
    sort_by = request.GET.get('sort', 'created_desc')  # デフォルトは新しい順
    
    # モーダル用のフォームを準備
    form = TaskForm()
    
    context = {
        'current_sort': sort_by,
        'form': form
    }
    return render(request, 'tasks/tasks/task_list.html', context)

def add_task(request: HttpRequest) -> HttpResponse:
    # フロントエンドで処理するため、直接アクセス時はリダイレクト
    return redirect('task_list')

def completed_tasks(request: HttpRequest) -> HttpResponse:
    sort_by = request.GET.get('sort', 'created_desc')
    
    # モーダル用のフォームを準備
    form = TaskForm()
    
    context = {
        'current_sort': sort_by,
        'form': form
    }
    return render(request, 'tasks/tasks/completed_tasks.html', context)

def overdue_tasks_view(request: HttpRequest) -> HttpResponse:
    sort_by = request.GET.get('sort', 'created_desc')
    
    # モーダル用のフォームを準備
    form = TaskForm()
    
    context = {
        'current_sort': sort_by,
        'form': form
    }
    return render(request, 'tasks/tasks/overdue_tasks.html', context)

def mark_task_as_completed(request: HttpRequest, task_id: int) -> HttpResponse:
    # フロントエンドで処理するため、リダイレクト
    return redirect('task_list')

def task_detail(request: HttpRequest, task_id: int) -> HttpResponse:
    # フロントエンドで処理するため、リダイレクト
    return redirect('task_list')

def delete_task(request: HttpRequest, task_id: int) -> HttpResponse:
    # フロントエンドで処理するため、リダイレクト
    return redirect('task_list')

def edit_task(request: HttpRequest, task_id: int) -> HttpResponse:
    # フロントエンドで処理するため、リダイレクト
    return redirect('task_list')

def shared_tasks(request: HttpRequest) -> HttpResponse:
    # 匿名ユーザー向けのため、共有機能は無効化
    return redirect('task_list')

def share_task(request: HttpRequest, task_id: int) -> HttpResponse:
    # 匿名ユーザー向けのため、共有機能は無効化
    return redirect('task_list')
