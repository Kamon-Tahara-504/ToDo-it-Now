from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
from tasks.decorators import login_required_with_cache

@login_required_with_cache
def settings_view(request: HttpRequest) -> HttpResponse:
    return render(request, 'tasks/settings/settings.html')
