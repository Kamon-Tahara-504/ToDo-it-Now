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

# GitHub PagesのベースURL（リポジトリ名）
BASE_URL = '/ToDo-it-Now/'

def ensure_dir(path):
    """ディレクトリが存在しない場合は作成"""
    path.mkdir(parents=True, exist_ok=True)

def copy_static_files():
    """静的ファイル（CSS、JS）をコピー"""
    source_static = BASE_DIR / 'tasks' / 'static'
    if not source_static.exists():
        print(f"警告: 静的ファイルのソースディレクトリが見つかりません: {source_static}")
        return False
    
    try:
        # 既存のstaticディレクトリを削除
        if STATIC_DIR.exists():
            shutil.rmtree(STATIC_DIR)
            print(f"既存の静的ファイルディレクトリを削除しました: {STATIC_DIR}")
        
        # 静的ファイルをコピー
        shutil.copytree(source_static, STATIC_DIR, dirs_exist_ok=True)
        
        # コピーされたファイル数を確認
        file_count = sum(1 for _ in STATIC_DIR.rglob('*') if _.is_file())
        print(f"静的ファイルをコピーしました: {STATIC_DIR} ({file_count}個のファイル)")
        return True
    except Exception as e:
        print(f"エラー: 静的ファイルのコピーに失敗しました: {e}")
        import traceback
        traceback.print_exc()
        return False

def render_template_to_html(template_name, output_path, context=None, base_path=''):
    """テンプレートをレンダリングしてHTMLファイルとして保存"""
    if context is None:
        context = {}
    
    try:
        # 出力パスに基づいて現在のパスを決定
        if 'overdue' in str(output_path):
            current_path = BASE_URL + 'overdue/'
        elif 'completed' in str(output_path):
            current_path = BASE_URL + 'completed/'
        else:
            current_path = BASE_URL
        
        # URL変数をコンテキストに追加（BASE_URLを含む）
        context['task_list_url'] = BASE_URL
        context['overdue_tasks_url'] = BASE_URL + 'overdue/'
        context['completed_tasks_url'] = BASE_URL + 'completed/'
        context['request'] = type('obj', (object,), {'path': current_path})()
        context['BASE_URL'] = BASE_URL
        
        # render_to_stringを使用（RequestContextを自動的に処理）
        html = render_to_string(template_name, context)
        
        # render_to_stringが既に{% static %}タグを処理して/static/パスを生成しているため、
        # 生成されたHTML内の/static/パスを直接/ToDo-it-Now/static/に置換
        # href="/static/... や src="/static/... のパターンを置換
        html = re.sub(r'(href|src)="/static/', r'\1="' + BASE_URL.rstrip('/') + '/static/', html)
        
        # 念のため、残っている{% static %}タグも処理（通常は存在しないはず）
        def replace_static(match):
            path = match.group(1).strip('\'"')
            # BASE_URL + 'static/' + path の形式に変換
            return BASE_URL.rstrip('/') + '/static/' + path.lstrip('/')
        
        html = re.sub(r'\{%\s*static\s+(["\'])(.*?)\1\s*%\}', replace_static, html)
        
        # {% url 'name' %} パターンを絶対パスに変換（BASE_URLを含む）
        url_mapping = {
            'task_list': BASE_URL,
            'overdue_tasks': BASE_URL + 'overdue/',
            'completed_tasks': BASE_URL + 'completed/',
            'index': BASE_URL,
        }
        
        def replace_url(match):
            url_name = match.group(1).strip('\'"')
            if url_name in url_mapping:
                return url_mapping[url_name]
            return BASE_URL
        
        html = re.sub(r'\{%\s*url\s+(["\'])(.*?)\1\s*%\}', replace_url, html)
        
        # {% url 'name' as variable %} パターンは既にコンテキストで処理されているので削除
        html = re.sub(r'\{%\s*url\s+(["\'])(.*?)\1\s+as\s+\w+\s*%\}', '', html)
        
        # 残りの未処理のDjangoテンプレートタグを削除
        html = re.sub(r'\{%\s*url\s+.*?%\}', '', html)
        
        # 残りのDjangoテンプレートタグをチェック
        remaining_tags = re.findall(r'\{%\s*[^%]+\s*%\}', html)
        if remaining_tags:
            print(f"警告: 未処理のDjangoテンプレートタグが残っています: {remaining_tags[:5]}")
        
        # {% load static %} タグを削除（既に処理済み）
        html = re.sub(r'\{%\s*load\s+static\s*%\}', '', html)
        
        # {% block %} タグを処理（既にレンダリングされているので削除）
        html = re.sub(r'\{%\s*block\s+\w+\s*%\}', '', html)
        html = re.sub(r'\{%\s*endblock\s*%\}', '', html)
        
        # {% extends %} タグを削除（既に処理済み）
        html = re.sub(r'\{%\s*extends\s+.*?%\}', '', html)
        
        # {% include %} タグは既に処理されているはずだが、残っている場合は警告
        if '{% include' in html:
            print("警告: {% include %} タグが残っている可能性があります")
        
        # 出力ディレクトリを作成
        ensure_dir(output_path.parent)
        
        # HTMLファイルを保存
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        
        # ファイルサイズを確認
        file_size = output_path.stat().st_size
        if file_size == 0:
            print(f"警告: 生成されたファイルが空です: {output_path}")
        elif file_size < 100:
            print(f"警告: 生成されたファイルが非常に小さいです ({file_size} bytes): {output_path}")
        
        print(f"生成しました: {output_path} ({file_size} bytes)")
        return True
    except Exception as e:
        import traceback
        print(f"エラー: {template_name} のレンダリングに失敗しました: {e}")
        traceback.print_exc()
        
        # エラーが発生した場合でも、最低限のHTMLを生成
        try:
            ensure_dir(output_path.parent)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Error - {template_name}</title>
</head>
<body>
    <h1>エラーが発生しました</h1>
    <p>テンプレートのレンダリング中にエラーが発生しました: {str(e)}</p>
</body>
</html>''')
            print(f"エラーページを生成しました: {output_path}")
            return False
        except Exception as e2:
            print(f"エラーページの生成にも失敗しました: {e2}")
            return False

def verify_generated_files():
    """生成されたファイルを検証"""
    print("\n=== 生成されたファイルの検証 ===")
    
    required_files = [
        OUTPUT_DIR / 'index.html',
        OUTPUT_DIR / 'overdue' / 'index.html',
        OUTPUT_DIR / 'completed' / 'index.html',
    ]
    
    all_ok = True
    for file_path in required_files:
        if file_path.exists():
            size = file_path.stat().st_size
            if size > 0:
                print(f"✓ {file_path.relative_to(BASE_DIR)} ({size} bytes)")
            else:
                print(f"✗ {file_path.relative_to(BASE_DIR)} (空のファイル)")
                all_ok = False
        else:
            print(f"✗ {file_path.relative_to(BASE_DIR)} (ファイルが存在しません)")
            all_ok = False
    
    # .nojekyllファイルの確認（空でも有効）
    nojekyll_file = OUTPUT_DIR / '.nojekyll'
    if nojekyll_file.exists():
        print(f"✓ {nojekyll_file.relative_to(BASE_DIR)} (存在します - 空でも有効)")
    else:
        print(f"✗ {nojekyll_file.relative_to(BASE_DIR)} (ファイルが存在しません)")
        all_ok = False
    
    # 静的ファイルディレクトリの確認
    if STATIC_DIR.exists():
        static_files = list(STATIC_DIR.rglob('*'))
        file_count = sum(1 for f in static_files if f.is_file())
        print(f"✓ 静的ファイル: {file_count}個のファイル")
    else:
        print(f"✗ 静的ファイルディレクトリが存在しません: {STATIC_DIR}")
        all_ok = False
    
    # index.htmlの内容を確認
    index_file = OUTPUT_DIR / 'index.html'
    if index_file.exists():
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()
            if '<!DOCTYPE html>' in content or '<html' in content:
                print(f"✓ index.htmlは有効なHTMLです")
            else:
                print(f"✗ index.htmlが有効なHTMLではない可能性があります")
                print(f"  最初の100文字: {content[:100]}")
                all_ok = False
    
    print("=" * 50)
    return all_ok

def generate_static_site():
    """静的サイトを生成"""
    print("静的サイトの生成を開始します...")
    print(f"出力ディレクトリ: {OUTPUT_DIR}")
    
    # 出力ディレクトリを作成
    ensure_dir(OUTPUT_DIR)
    
    # 静的ファイルをコピー
    if not copy_static_files():
        print("警告: 静的ファイルのコピーに失敗しましたが、続行します...")
    
    # 各ページを生成
    context = {
        'current_sort': 'created_desc',
        'form': None,
    }
    
    success_count = 0
    total_count = 0
    
    # メインページ（タスク一覧）
    total_count += 1
    if render_template_to_html(
        'tasks/tasks/task_list.html',
        OUTPUT_DIR / 'index.html',
        context
    ):
        success_count += 1
    
    # タスク一覧ページ
    total_count += 1
    if render_template_to_html(
        'tasks/tasks/task_list.html',
        OUTPUT_DIR / 'tasks' / 'index.html',
        context
    ):
        success_count += 1
    
    # 期限切れタスクページ
    total_count += 1
    if render_template_to_html(
        'tasks/tasks/overdue_tasks.html',
        OUTPUT_DIR / 'overdue' / 'index.html',
        context
    ):
        success_count += 1
    
    # 完了済みタスクページ
    total_count += 1
    if render_template_to_html(
        'tasks/tasks/completed_tasks.html',
        OUTPUT_DIR / 'completed' / 'index.html',
        context
    ):
        success_count += 1
    
    # 404.html（GitHub Pages用）
    try:
        with open(OUTPUT_DIR / '404.html', 'w', encoding='utf-8') as f:
            f.write(f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url={BASE_URL}">
    <title>404 - Page Not Found</title>
</head>
<body>
    <p>ページが見つかりません。トップページにリダイレクトします...</p>
    <script>window.location.href = '{BASE_URL}';</script>
</body>
</html>''')
        print(f"404.htmlを生成しました")
    except Exception as e:
        print(f"エラー: 404.htmlの生成に失敗しました: {e}")
    
    # .nojekyllファイルを作成（Jekyllの処理をスキップ）
    try:
        with open(OUTPUT_DIR / '.nojekyll', 'w', encoding='utf-8') as f:
            f.write('')
        print(f".nojekyllファイルを作成しました")
    except Exception as e:
        print(f"エラー: .nojekyllファイルの作成に失敗しました: {e}")
    
    print(f"\nページ生成: {success_count}/{total_count} 成功")
    
    # 生成されたファイルを検証
    if verify_generated_files():
        print("\n静的サイトの生成が完了しました！")
        return 0
    else:
        print("\n警告: 一部のファイルに問題があります。上記の検証結果を確認してください。")
        return 1

if __name__ == '__main__':
    exit_code = generate_static_site()
    sys.exit(exit_code)

