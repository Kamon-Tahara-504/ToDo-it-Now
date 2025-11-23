from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.contrib import messages
from django.http import HttpRequest, HttpResponse

from tasks.models import Task
from tasks.forms import TaskForm
from tasks.decorators import login_required_with_cache
from tasks.utils import get_sorted_tasks, redirect_with_referer
from tasks.selectors import (
    get_active_tasks, 
    get_completed_tasks, 
    get_overdue_tasks, 
    get_shared_tasks
)
from tasks.services import mark_task_completed, toggle_task_share

def index(request: HttpRequest) -> HttpResponse:
    if request.user.is_authenticated:
        return redirect('task_list')  # ログイン済みの場合はタスク一覧へ
    return redirect('login')  # 未ログインの場合はログインページへ変更

@login_required_with_cache
def task_list(request: HttpRequest) -> HttpResponse:
    sort_by = request.GET.get('sort', 'created_desc')  # デフォルトは新しい順
    
    tasks = get_active_tasks(request.user)
    tasks = get_sorted_tasks(tasks, sort_by)
    
    # モーダル用のフォームを準備
    form = TaskForm()
    
    context = {
        'tasks': tasks,
        'current_sort': sort_by,
        'form': form
    }
    return render(request, 'tasks/tasks/task_list.html', context)

@login_required_with_cache
def add_task(request: HttpRequest) -> HttpResponse:
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user
            task.completed = False  # 明示的に未完了状態を設定
            task.save()
            messages.success(request, 'タスクが作成されました！')
            return redirect('task_list')
    else:
        form = TaskForm()
    return render(request, 'tasks/tasks/add_task.html', {'form': form})

@login_required_with_cache
def completed_tasks(request: HttpRequest) -> HttpResponse:
    sort_by = request.GET.get('sort', 'created_desc')
    
    tasks = get_completed_tasks(request.user)
    tasks = get_sorted_tasks(tasks, sort_by)
    
    # モーダル用のフォームを準備
    form = TaskForm()
    
    context = {
        'tasks': tasks,
        'current_sort': sort_by,
        'form': form
    }
    return render(request, 'tasks/tasks/completed_tasks.html', context)

@login_required_with_cache
def overdue_tasks_view(request: HttpRequest) -> HttpResponse:
    sort_by = request.GET.get('sort', 'created_desc')
    
    overdue_tasks = get_overdue_tasks(request.user)
    overdue_tasks = get_sorted_tasks(overdue_tasks, sort_by)
    
    # モーダル用のフォームを準備
    form = TaskForm()
    
    context = {
        'overdue_tasks': overdue_tasks,
        'current_sort': sort_by,
        'form': form
    }
    return render(request, 'tasks/tasks/overdue_tasks.html', context)

@login_required_with_cache
def mark_task_as_completed(request: HttpRequest, task_id: int) -> HttpResponse:
    task = get_object_or_404(Task, id=task_id)
    mark_task_completed(task)
    
    return redirect_with_referer(request, 'task_list')

@login_required_with_cache
def task_detail(request: HttpRequest, task_id: int) -> HttpResponse:
    task = get_object_or_404(Task, id=task_id)
    # リファラー（前のページのURL）を取得
    referer = request.META.get('HTTP_REFERER', '')
    
    # リファラーからどのページから来たかを判断
    if 'overdue' in referer:
        back_url = 'overdue_tasks'
    elif 'completed' in referer:
        back_url = 'completed_tasks'
    else:
        back_url = 'task_list'
        
    context = {
        'task': task,
        'back_url': back_url
    }
    return render(request, 'tasks/tasks/task_detail.html', context)

@login_required_with_cache
def delete_task(request: HttpRequest, task_id: int) -> HttpResponse:
    task = get_object_or_404(Task, id=task_id)
    task.delete()
    
    return redirect_with_referer(request, 'task_list')

@login_required_with_cache
def edit_task(request: HttpRequest, task_id: int) -> HttpResponse:
    task = get_object_or_404(Task, id=task_id, user=request.user)
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            messages.success(request, 'タスクが更新されました！')
            return redirect('task_list')
    else:
        form = TaskForm(instance=task)
    
    return render(request, 'tasks/tasks/edit_task.html', {
        'form': form,
        'task': task
    })

@login_required_with_cache
def shared_tasks(request: HttpRequest) -> HttpResponse:
    # ログインユーザーが共有したタスクを取得
    tasks = get_shared_tasks(request.user)
    
    # 期限が設定されているタスクのみを取得
    tasks_with_deadline = tasks.exclude(deadline__isnull=True)
    
    # モーダル用のフォームを準備
    form = TaskForm()
    
    return render(request, 'tasks/tasks/shared_tasks.html', {
        'tasks': tasks_with_deadline,
        'form': form
    })

@login_required_with_cache
def share_task(request: HttpRequest, task_id: int) -> HttpResponse:
    task = get_object_or_404(Task, id=task_id)
    
    if request.method == 'POST':
        is_shared = toggle_task_share(task, request.user)
        if is_shared:
            messages.success(request, "タスクが共有されました")
        else:
            messages.success(request, "タスクの共有を解除しました")
        
        return redirect_with_referer(request, 'task_list')
    
    return redirect('task_list')
