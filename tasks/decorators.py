from functools import wraps
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache


def login_required_with_cache(view_func):
    """
    ログイン必須かつキャッシュ無効化のデコレータ
    
    @login_required(login_url='login')と@never_cacheの組み合わせを
    共通化したデコレータ
    """
    @wraps(view_func)
    @login_required(login_url='login')
    @never_cache
    def wrapped_view(request, *args, **kwargs):
        return view_func(request, *args, **kwargs)
    return wrapped_view

