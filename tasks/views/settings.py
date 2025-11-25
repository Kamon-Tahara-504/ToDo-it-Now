from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.contrib import messages
from django.http import HttpRequest, HttpResponse
from tasks.decorators import login_required_with_cache

@login_required_with_cache
def settings_view(request: HttpRequest) -> HttpResponse:
    user = request.user
    context = {
        'username': user.username,
        'email': user.email if user.email else None,
        'date_joined': user.date_joined,
        'last_login': user.last_login,
    }
    return render(request, 'tasks/settings/settings.html', context)

@login_required_with_cache
def delete_account(request: HttpRequest) -> HttpResponse:
    """アカウント削除処理"""
    if request.method == 'POST':
        user = request.user
        username = user.username
        
        # ユーザーを削除（関連するタスクもCASCADEで削除される）
        user.delete()
        
        # ログアウト処理
        logout(request)
        
        messages.success(request, f'アカウント「{username}」が削除されました。')
        return redirect('login')
    
    # GETリクエストの場合は設定画面にリダイレクト
    return redirect('settings')
