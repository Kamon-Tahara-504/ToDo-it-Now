from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from .models import Task
from .forms import TaskForm, UserRegisterForm
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters


def index(request):
    if request.user.is_authenticated:
        return redirect('task_list')  # ログイン済みの場合はタスク一覧へ
    return redirect('login')  # 未ログインの場合はログインページへ変更

@login_required(login_url='login')  # 未ログインの場合は登録ページへリダイレクト
@never_cache
def task_list(request):
    sort_by = request.GET.get('sort', 'created_desc')  # デフォルトは新しい順
    
    tasks = Task.objects.filter(completed=False, deadline__gte=timezone.now(), user=request.user)
    
    if sort_by == 'created_asc':
        tasks = tasks.order_by('id')  # 古い順
    elif sort_by == 'created_desc':
        tasks = tasks.order_by('-id')  # 新しい順
    elif sort_by == 'deadline':
        tasks = tasks.order_by('deadline')  # 締切順
    
    context = {
        'tasks': tasks,
        'current_sort': sort_by
    }
    return render(request, 'todo_app/task_list.html', context)

@login_required(login_url='login')
@never_cache
def add_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user
            task.created_at = timezone.now()  # 作成日時を明示的に設定
            task.updated_at = timezone.now()  # 更新日時を明示的に設定
            task.save()
            messages.success(request, 'タスクが作成されました！')
            return redirect('task_list')
    else:
        form = TaskForm()
    return render(request, 'todo_app/add_task.html', {'form': form})

@login_required(login_url='login')
@never_cache
def completed_tasks(request):
    sort_by = request.GET.get('sort', 'created_desc')
    
    tasks = Task.objects.filter(completed=True, user=request.user)
    
    if sort_by == 'created_asc':
        tasks = tasks.order_by('id')
    elif sort_by == 'created_desc':
        tasks = tasks.order_by('-id')
    elif sort_by == 'deadline':
        tasks = tasks.order_by('deadline')
    
    context = {
        'tasks': tasks,
        'current_sort': sort_by
    }
    return render(request, 'todo_app/completed_tasks.html', context)

@login_required(login_url='login')
@never_cache
def overdue_tasks_view(request):
    sort_by = request.GET.get('sort', 'created_desc')
    
    overdue_tasks = Task.objects.filter(
        deadline__lt=timezone.now(), 
        completed=False,
        user=request.user
    )
    
    if sort_by == 'created_asc':
        overdue_tasks = overdue_tasks.order_by('id')
    elif sort_by == 'created_desc':
        overdue_tasks = overdue_tasks.order_by('-id')
    elif sort_by == 'deadline':
        overdue_tasks = overdue_tasks.order_by('deadline')
    
    context = {
        'overdue_tasks': overdue_tasks,
        'current_sort': sort_by
    }
    return render(request, 'todo_app/overdue_tasks.html', context)

@login_required(login_url='login')
@never_cache
def mark_task_as_completed(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.completed = True
    task.completed_at = timezone.now()
    task.save()
    
    # リファラー（前のページのURL）を取得
    referer = request.META.get('HTTP_REFERER')
    if referer:
        return HttpResponseRedirect(referer)
    return redirect('task_list')  # フォールバック

@login_required(login_url='login')
@never_cache
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

@login_required(login_url='login')
@never_cache
def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.delete()
    
    # リファラー（前のページのURL）を取得
    referer = request.META.get('HTTP_REFERER')
    if referer:
        return HttpResponseRedirect(referer)
    return redirect('task_list')  # フォールバック

@login_required(login_url='login')
@never_cache
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
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    
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
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response

@login_required(login_url='login')
@never_cache
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
    
    return render(request, 'todo_app/add_task.html', {
        'form': form,
        'edit_mode': True,
        'task': task
    })

@login_required
def shared_tasks(request):
    # ログインユーザーが共有したタスクを取得
    tasks = Task.objects.filter(shared_with=request.user).distinct()
    
    # 期限が設定されているタスクのみを取得
    tasks_with_deadline = tasks.exclude(deadline__isnull=True)
    
    return render(request, 'todo_app/shared_tasks.html', {
        'tasks': tasks_with_deadline
    })

@login_required(login_url='login')
@never_cache
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
        
        # リファラー（前のページのURL）を取得
        referer = request.META.get('HTTP_REFERER')
        if referer:
            return HttpResponseRedirect(referer)
    
    return redirect('task_list')



