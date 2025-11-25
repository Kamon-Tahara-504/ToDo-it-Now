from django.shortcuts import render
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
