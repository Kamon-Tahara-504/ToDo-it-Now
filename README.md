# ToDo-it-Now

ToDo-it-Now は、Django で構築された多機能なタスク管理アプリケーションです。直感的なインターフェースで、個人のタスク管理からチームでのタスク共有まで幅広くサポートします。

## 機能一覧

*   **ユーザー認証**:
    *   アカウント登録・ログイン・ログアウト機能により、個人のデータを安全に管理します。
*   **タスク管理**:
    *   タスクの作成、編集、削除が簡単に行えます。
    *   タスクにタイトル、詳細な説明、期限を設定できます。
*   **タスク整理**:
    *   **カラーコーディング**: タスクに色を設定して視覚的に整理できます。
    *   **期限管理**: 期限を設定し、期限切れのタスクを自動的に識別します。
*   **タスク共有機能**:
    *   他の登録ユーザーとタスクを共有し、共同で進捗を確認できます。
*   **状態追跡**:
    *   未完了、完了、期限切れのタスクをフィルタリングして表示します。
    *   完了したタスクの履歴を確認できます。
*   **ユーザー設定**:
    *   アプリケーションの表示設定などをカスタマイズできます（ナイトモードなど）。

## ファイル構成

主要なディレクトリとファイルの詳細な構成は以下の通りです。

```
ToDo-it-Now/
├── config/                     # プロジェクト全体の設定
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py             # Django設定（DB、アプリ、静的ファイル設定など）
│   ├── urls.py                 # プロジェクト全体のURLルーティング
│   └── wsgi.py
├── tasks/                      # アプリケーションのメインディレクトリ
│   ├── __init__.py
│   ├── admin.py                # 管理画面設定
│   ├── apps.py                 # アプリケーション設定
│   ├── decorators.py           # カスタムデコレータ
│   ├── forms.py                # フォーム定義（TaskForm, UserRegistrationFormなど）
│   ├── migrations/             # データベースマイグレーションファイル
│   │   ├── 0001_initial.py
│   │   ├── ...
│   │   └── 0010_remove_task_is_completed.py
│   ├── models.py               # データモデル（Taskモデルなど）
│   ├── selectors.py            # データ取得ロジック
│   ├── services.py             # ビジネスロジック
│   ├── static/                 # 静的ファイル
│   │   ├── css/                # スタイルシート
│   │   │   ├── base.css        # 基本スタイル
│   │   │   ├── buttons.css     # ボタンスタイル
│   │   │   ├── modals.css      # モーダルウィンドウ用スタイル
│   │   │   ├── night_mode.css  # ナイトモード用スタイル
│   │   │   ├── settings.css    # 設定画面用スタイル
│   │   │   ├── styles.css      # 汎用スタイル
│   │   │   └── task_list.css   # タスクリスト用スタイル
│   │   └── js/                 # JavaScriptファイル
│   │       ├── color_picker.js
│   │       ├── design_utils.js
│   │       ├── form_validation.js
│   │       ├── settings.js
│   │       ├── shared_tasks.js
│   │       └── task_interactions.js
│   ├── templates/              # HTMLテンプレート
│   │   └── tasks/
│   │       ├── auth/           # 認証関連
│   │       │   ├── auth_base.html
│   │       │   ├── login.html
│   │       │   └── register.html
│   │       ├── base.html       # ベーステンプレート
│   │       ├── includes/       # 再利用可能なコンポーネント
│   │       │   ├── color_picker.html
│   │       │   ├── create_task_button.html
│   │       │   ├── modals/     # モーダルテンプレート
│   │       │   │   ├── complete_modal.html
│   │       │   │   ├── delete_modal.html
│   │       │   │   ├── share_modal.html
│   │       │   │   ├── unshare_modal.html
│   │       │   │   └── warning_modal.html
│   │       │   ├── sort_buttons.html
│   │       │   ├── task_action_buttons.html
│   │       │   ├── task_card.html
│   │       │   ├── task_card_shared.html
│   │       │   └── task_form.html
│   │       ├── settings/       # 設定関連
│   │       │   └── settings.html
│   │       └── tasks/          # タスク表示関連
│   │           ├── add_task.html
│   │           ├── completed_tasks.html
│   │           ├── edit_task.html
│   │           ├── overdue_tasks.html
│   │           ├── shared_tasks.html
│   │           ├── task_detail.html
│   │           └── task_list.html
│   ├── templatetags/           # カスタムテンプレートタグ
│   │   └── __init__.py
│   ├── tests.py                # テストコード
│   ├── urls.py                 # アプリケーション内URLルーティング
│   ├── utils.py                # ユーティリティ関数
│   └── views/                  # ビュー（コントローラー）
│       ├── __init__.py
│       ├── auth.py             # 認証関連ビュー
│       ├── settings.py         # 設定関連ビュー
│       └── tasks.py            # タスク操作関連ビュー
├── db.sqlite3                  # SQLiteデータベース
├── manage.py                   # Django管理コマンド
└── README.md                   # ドキュメント
```

## 環境

*   Python 3.12+
*   Django 5.1+

## GitHub Pagesへのデプロイ

このアプリケーションはGitHub Pagesにデプロイできます。

### 初回設定（重要）

GitHub Pagesを有効にするには、以下の手順を実行してください：

1. **GitHubリポジトリの設定を開く**
   - GitHubリポジトリのページに移動
   - 「Settings」タブをクリック

2. **Pagesの設定**
   - 左側のメニューから「Pages」を選択
   - 「Source」セクションで「GitHub Actions」を選択
   - これにより、GitHub Actionsワークフローが自動的にGitHub Pagesを有効化します

3. **権限の確認**
   - 「Settings」→「Actions」→「General」に移動
   - 「Workflow permissions」セクションで「Read and write permissions」が選択されていることを確認
   - 「Allow GitHub Actions to create and approve pull requests」にチェックが入っていることを確認

### デプロイ手順

1. **GitHubリポジトリにプッシュ**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

2. **自動デプロイ**
   - `main`ブランチまたは`feature/anonymous-tasks`ブランチにプッシュすると、GitHub Actionsが自動的に実行されます
   - 静的ファイルが`docs`フォルダに生成され、GitHub Pagesにデプロイされます
   - デプロイが完了すると、`https://[ユーザー名].github.io/[リポジトリ名]/` でアクセスできます

### ローカルでの静的ファイル生成

ローカルで静的ファイルを生成して確認する場合：

```bash
python scripts/generate_static.py
```

生成されたファイルは`docs`フォルダに出力されます。

### トラブルシューティング

**エラー: "Get Pages site failed"**
- GitHubリポジトリの「Settings」→「Pages」で「Source」が「GitHub Actions」に設定されているか確認してください
- ワークフローファイルに`enablement: true`パラメータが追加されているか確認してください（既に追加済みです）

**デプロイが失敗する場合**
- GitHub Actionsのログを確認して、エラーメッセージを確認してください
- `docs`フォルダが正しく生成されているか確認してください

### 注意事項

- GitHub Pagesは静的サイトのみをサポートしています
- データはブラウザのsessionStorageに保存されます
- テンプレートタスクは初回アクセス時に自動的に表示されます
