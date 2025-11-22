from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters
from django.http import HttpRequest, HttpResponse

from tasks.forms import UserRegisterForm
from tasks.utils import set_no_cache_headers

def register(request: HttpRequest) -> HttpResponse:
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
    return render(request, 'tasks/auth/register.html', {'form': form})

@csrf_protect
@never_cache
@sensitive_post_parameters('password')
def user_login(request: HttpRequest) -> HttpResponse:
    if request.user.is_authenticated:
        return redirect('task_list')
    
    response = render(request, 'tasks/auth/login.html')
    response = set_no_cache_headers(response)
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('task_list')
        else:
            messages.error(request, 'ユーザー名またはパスワードが正しくありません。')
    
    return response

@login_required
@never_cache
def user_logout(request: HttpRequest) -> HttpResponse:
    logout(request)
    response = redirect('login')
    response = set_no_cache_headers(response)
    return response
