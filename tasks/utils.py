from django.http import HttpResponseRedirect
from django.shortcuts import redirect


def get_sorted_tasks(queryset, sort_by):
    """
    タスククエリセットをソートするヘルパー関数
    
    Args:
        queryset: Taskクエリセット
        sort_by: ソートキー ('created_asc', 'created_desc', 'deadline')
    
    Returns:
        ソートされたクエリセット
    """
    if sort_by == 'created_asc':
        return queryset.order_by('id')  # 古い順
    elif sort_by == 'created_desc':
        return queryset.order_by('-id')  # 新しい順
    elif sort_by == 'deadline':
        return queryset.order_by('deadline')  # 締切順
    
    # デフォルトは新しい順
    return queryset.order_by('-id')


def redirect_with_referer(request, fallback_url):
    """
    リファラーを優先的に使用してリダイレクトするヘルパー関数
    
    Args:
        request: HttpRequestオブジェクト
        fallback_url: リファラーがない場合のフォールバックURL
    
    Returns:
        HttpResponseRedirectオブジェクト
    """
    referer = request.META.get('HTTP_REFERER')
    if referer:
        return HttpResponseRedirect(referer)
    return redirect(fallback_url)


def set_no_cache_headers(response):
    """
    レスポンスにキャッシュ無効化ヘッダーを設定するヘルパー関数
    
    Args:
        response: HttpResponseオブジェクト
    
    Returns:
        ヘッダーが設定されたレスポンスオブジェクト
    """
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response

