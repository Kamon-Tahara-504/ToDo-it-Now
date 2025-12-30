#!/usr/bin/env python
"""
静的ファイル生成スクリプト
Djangoのテンプレートを静的HTMLに変換し、GitHub Pages用の静的ファイルを生成します。
"""

import os
import sys
import shutil
import re
from pathlib import Path
from django.conf import settings
from django.template.loader import render_to_string, get_template
from django.template import Context, RequestContext
from django.test import RequestFactory
import django

# プロジェクトのルートディレクトリを取得
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

# Djangoの設定
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# 出力ディレクトリ
OUTPUT_DIR = BASE_DIR / 'docs'
STATIC_DIR = OUTPUT_DIR / 'static'

def ensure_dir(path):
    """ディレクトリが存在しない場合は作成"""
    path.mkdir(parents=True, exist_ok=True)

def copy_static_files():
    """静的ファイル（CSS、JS）をコピー"""
    source_static = BASE_DIR / 'tasks' / 'static'
    if source_static.exists():
        # 既存のstaticディレクトリを削除
        if STATIC_DIR.exists():
            shutil.rmtree(STATIC_DIR)
        
        # 静的ファイルをコピー
        shutil.copytree(source_static, STATIC_DIR, dirs_exist_ok=True)
        print(f"静的ファイルをコピーしました: {STATIC_DIR}")

def render_template_to_html(template_name, output_path, context=None, base_path=''):
    """テンプレートをレンダリングしてHTMLファイルとして保存"""
    if context is None:
        context = {}
    
    try:
        # 出力パスに基づいて現在のパスを決定
        if 'overdue' in str(output_path):
            current_path = '/overdue/'
        elif 'completed' in str(output_path):
            current_path = '/completed/'
        else:
            current_path = '/'
        
        # URL変数をコンテキストに追加
        context['task_list_url'] = '/'
        context['overdue_tasks_url'] = '/overdue/'
        context['completed_tasks_url'] = '/completed/'
        context['request'] = type('obj', (object,), {'path': current_path})()
        
        # RequestContextを使用してstaticタグを正しく処理
        factory = RequestFactory()
        request = factory.get(current_path)
        request_context = RequestContext(request, context)
        
        template = get_template(template_name)
        html = template.render(request_context)
        
        # {% static 'path' %} を相対パスに変換
        # 出力パスに基づいて相対パスを計算
        depth = len(output_path.parent.relative_to(OUTPUT_DIR).parts) if output_path.parent != OUTPUT_DIR else 0
        static_prefix = '../' * depth + 'static/' if depth > 0 else 'static/'
        
        # {% static '...' %} パターンを置換
        def replace_static(match):
            path = match.group(1).strip('\'"')
            return static_prefix + path
        
        html = re.sub(r'\{%\s*static\s+(["\'])(.*?)\1\s*%\}', replace_static, html)
        
        # {% url 'name' %} パターンを相対パスに変換
        url_mapping = {
            'task_list': '/',
            'overdue_tasks': '/overdue/',
            'completed_tasks': '/completed/',
            'index': '/',
        }
        
        def replace_url(match):
            url_name = match.group(1).strip('\'"')
            if url_name in url_mapping:
                return url_mapping[url_name]
            return '/'
        
        html = re.sub(r'\{%\s*url\s+(["\'])(.*?)\1\s*%\}', replace_url, html)
        
        # {% url 'name' as variable %} パターンは既にコンテキストで処理されているので削除
        html = re.sub(r'\{%\s*url\s+(["\'])(.*?)\1\s+as\s+\w+\s*%\}', '', html)
        
        # 残りの未処理のDjangoテンプレートタグを削除
        html = re.sub(r'\{%\s*url\s+.*?%\}', '', html)
        
        # 出力ディレクトリを作成
        ensure_dir(output_path.parent)
        
        # HTMLファイルを保存
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"生成しました: {output_path}")
    except Exception as e:
        import traceback
        print(f"エラー: {template_name} のレンダリングに失敗しました: {e}")
        traceback.print_exc()

def generate_static_site():
    """静的サイトを生成"""
    print("静的サイトの生成を開始します...")
    
    # 出力ディレクトリを作成
    ensure_dir(OUTPUT_DIR)
    
    # 静的ファイルをコピー
    copy_static_files()
    
    # 各ページを生成
    context = {
        'current_sort': 'created_desc',
        'form': None,
    }
    
    # メインページ（タスク一覧）
    render_template_to_html(
        'tasks/tasks/task_list.html',
        OUTPUT_DIR / 'index.html',
        context
    )
    
    # タスク一覧ページ
    render_template_to_html(
        'tasks/tasks/task_list.html',
        OUTPUT_DIR / 'tasks' / 'index.html',
        context
    )
    
    # 期限切れタスクページ
    render_template_to_html(
        'tasks/tasks/overdue_tasks.html',
        OUTPUT_DIR / 'overdue' / 'index.html',
        context
    )
    
    # 完了済みタスクページ
    render_template_to_html(
        'tasks/tasks/completed_tasks.html',
        OUTPUT_DIR / 'completed' / 'index.html',
        context
    )
    
    # 404.html（GitHub Pages用）
    with open(OUTPUT_DIR / '404.html', 'w', encoding='utf-8') as f:
        f.write('''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=/">
    <title>404 - Page Not Found</title>
</head>
<body>
    <p>ページが見つかりません。トップページにリダイレクトします...</p>
    <script>window.location.href = '/';</script>
</body>
</html>''')
    
    # .nojekyllファイルを作成（Jekyllの処理をスキップ）
    with open(OUTPUT_DIR / '.nojekyll', 'w', encoding='utf-8') as f:
        f.write('')
    
    print("静的サイトの生成が完了しました！")

if __name__ == '__main__':
    generate_static_site()

