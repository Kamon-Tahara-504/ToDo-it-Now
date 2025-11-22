from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from .models import Task
from .forms import TaskForm, UserRegisterForm
from .decorators import login_required_with_cache
from .utils import get_sorted_tasks, redirect_with_referer, set_no_cache_headers
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib import messages
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters


def index(request):
    if request.user.is_authenticated:
        return redirect('task_list')  # ログイン済みの場合はタスク一覧へ
    return redirect('login')  # 未ログインの場合はログインページへ変更

@login_required_with_cache
def task_list(request):
    sort_by = request.GET.get('sort', 'created_desc')  # デフォルトは新しい順
    
    tasks = Task.objects.filter(completed=False, deadline__gte=timezone.now(), user=request.user)
    tasks = get_sorted_tasks(tasks, sort_by)
    
    context = {
        'tasks': tasks,
        'current_sort': sort_by
    }
    return render(request, 'todo_app/task_list.html', context)

@login_required_with_cache
def add_task(request):
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
    return render(request, 'todo_app/add_task.html', {'form': form})

@login_required_with_cache
def completed_tasks(request):
    sort_by = request.GET.get('sort', 'created_desc')
    
    tasks = Task.objects.filter(completed=True, user=request.user)
    tasks = get_sorted_tasks(tasks, sort_by)
    
    context = {
        'tasks': tasks,
        'current_sort': sort_by
    }
    return render(request, 'todo_app/completed_tasks.html', context)

@login_required_with_cache
def overdue_tasks_view(request):
    sort_by = request.GET.get('sort', 'created_desc')
    
    overdue_tasks = Task.objects.filter(
        deadline__lt=timezone.now(), 
        completed=False,
        user=request.user
    )
    overdue_tasks = get_sorted_tasks(overdue_tasks, sort_by)
    
    context = {
        'overdue_tasks': overdue_tasks,
        'current_sort': sort_by
    }
    return render(request, 'todo_app/overdue_tasks.html', context)

@login_required_with_cache
def mark_task_as_completed(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.completed = True
    task.completed_at = timezone.now()
    task.save()
    
    return redirect_with_referer(request, 'task_list')

@login_required_with_cache
def task_detail(request, task_id):
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
    return render(request, 'todo_app/task_detail.html', context)

@login_required_with_cache
def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.delete()
    
    return redirect_with_referer(request, 'task_list')

@login_required_with_cache
def settings_view(request):
    return render(request, 'todo_app/settings.html')

# ユーザー登録ビュー
def register(request):
    if request.user.is_authenticated:
        return redirect('task_list')
        
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            try:
                user = form.save()
                login(request, user)
                messages.success(request, 'アカウントが正常に作成されました！')
                return redirect('task_list')
            except Exception as e:
                messages.error(request, f'アカウント作成中にエラーが発生しました: {str(e)}')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f'{field}: {error}')
    else:
        form = UserRegisterForm()
    return render(request, 'todo_app/register.html', {'form': form})

# ログインビュー
@csrf_protect
@never_cache
@sensitive_post_parameters('password')
def user_login(request):
    if request.user.is_authenticated:
        return redirect('task_list')
    
    response = render(request, 'todo_app/login.html')
    response = set_no_cache_headers(response)
    
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('task_list')
        else:
            messages.error(request, 'ユーザー名またはパスワードが正しくありません。')
    
    return response

# ログアウトビュー
@login_required
@never_cache
def user_logout(request):
    logout(request)
    response = redirect('login')
    response = set_no_cache_headers(response)
    return response

@login_required_with_cache
def edit_task(request, task_id):
    task = get_object_or_404(Task, id=task_id, user=request.user)
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            messages.success(request, 'タスクが更新されました！')
            return redirect('task_list')
    else:
        form = TaskForm(instance=task)
    
    return render(request, 'todo_app/edit_task.html', {
        'form': form,
        'task': task
    })

@login_required_with_cache
def shared_tasks(request):
    # ログインユーザーが共有したタスクを取得
    tasks = Task.objects.filter(shared_with=request.user).distinct()
    
    # 期限が設定されているタスクのみを取得
    tasks_with_deadline = tasks.exclude(deadline__isnull=True)
    
    return render(request, 'todo_app/shared_tasks.html', {
        'tasks': tasks_with_deadline
    })

@login_required_with_cache
def share_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    
    if request.method == 'POST':
        # 共有状態を確認
        is_shared = task.shared_with.filter(id=request.user.id).exists()
        
        if is_shared:
            # すでに共有されている場合は共有を解除
            task.shared_with.remove(request.user)
            messages.success(request, "タスクの共有を解除しました")
        else:
            # 共有されていない場合は共有を追加
            task.shared_with.add(request.user)
            messages.success(request, "タスクが共有されました")
        
        return redirect_with_referer(request, 'task_list')
    
    return redirect('task_list')



