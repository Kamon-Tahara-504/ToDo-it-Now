/**
 * タスクの表示を管理するモジュール
 */

const TaskDisplay = {
    /**
     * タスクカードのHTMLを生成
     * @param {Object} task - タスクオブジェクト
     * @param {Object} options - 表示オプション
     * @returns {string} タスクカードのHTML
     */
    createTaskCardHTML: function(task, options = {}) {
        const showShare = options.showShare !== false;
        const showEdit = options.showEdit !== false;
        const showComplete = options.showComplete !== false;
        const showDelete = options.showDelete !== false;
        const showCompletedAt = options.showCompletedAt || false;
        
        const deadlineText = task.deadline 
            ? this.formatDateTime(task.deadline)
            : '期限なし';
        
        const createdDateText = this.formatDateTime(task.created_at);
        const completedDateText = task.completed_at 
            ? this.formatDateTime(task.completed_at)
            : '';
        
        let actionButtonsHTML = '<div class="task-actions">';
        
        if (showShare) {
            // 共有機能は削除（匿名ユーザー向けのため）
        }
        
        if (showEdit) {
            actionButtonsHTML += `
                <button type="button" class="btn btn-outline-primary rounded-circle task-action-btn" 
                        data-task-id="${task.id}" data-action="edit" 
                        id="editTaskBtn-${task.id}" aria-label="編集">
                    <i class="fas fa-edit"></i>
                </button>
            `;
        }
        
        if (showComplete && !task.completed) {
            actionButtonsHTML += `
                <button type="button" class="btn btn-outline-success rounded-circle task-action-btn complete-task-btn" 
                        data-task-id="${task.id}" aria-label="完了">
                    <i class="fas fa-check"></i>
                </button>
            `;
        }
        
        if (showDelete) {
            actionButtonsHTML += `
                <button type="button" class="btn btn-outline-danger rounded-circle task-action-btn delete-task-btn" 
                        data-task-id="${task.id}" aria-label="削除">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        }
        
        actionButtonsHTML += '</div>';
        
        const descriptionHTML = task.description && task.description.length > 0
            ? `<p style="color: var(--text-color);"><strong>メモ:</strong> ${this.escapeHtml(task.description)}</p>`
            : '<p style="color: var(--text-color);"><strong>メモ:</strong> <span style="color: var(--text-color); font-style: italic;">メモは入力されていません</span></p>';
        
        const completedAtHTML = showCompletedAt && completedDateText
            ? `<p style="color: var(--text-color);"><strong>完了日:</strong> ${completedDateText}</p>`
            : '';
        
        return `
            <div class="task-card ${task.color} tape-design" style="background-color: ${task.color};" data-task-id="${task.id}">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="task-content">
                        <h5 style="color: var(--text-black); margin-bottom: 5px;">${this.escapeHtml(task.title)}</h5>
                        <small style="color: var(--text-black);">達成期限: ${deadlineText}</small>
                    </div>
                    ${actionButtonsHTML}
                </div>
                <div class="task-details" style="display: none; margin-top: 10px; padding: 10px; background-color: rgba(255, 255, 255, 0.3); border-radius: 4px;">
                    ${descriptionHTML}
                    <p style="color: var(--text-color);"><strong>作成日:</strong> ${createdDateText}</p>
                    ${completedAtHTML}
                </div>
            </div>
        `;
    },
    
    /**
     * タスク一覧を表示
     * @param {Array} tasks - 表示するタスクの配列
     * @param {string} containerId - コンテナのID
     * @param {Object} options - 表示オプション
     */
    renderTasks: function(tasks, containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`コンテナが見つかりません: ${containerId}`);
            return;
        }
        
        if (tasks.length === 0) {
            container.innerHTML = '<div class="empty-message"><p>タスクはありません。</p></div>';
            return;
        }
        
        const tasksHTML = tasks.map(task => 
            this.createTaskCardHTML(task, options)
        ).join('');
        
        container.innerHTML = tasksHTML;
        
        // タスクカードのクリックイベントを再初期化
        if (typeof initTaskCardClick === 'function') {
            initTaskCardClick();
        }
        
        // 完了ボタンのイベントリスナーを追加
        container.querySelectorAll('.complete-task-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const taskId = parseInt(this.getAttribute('data-task-id'));
                if (taskId) {
                    TaskDisplay.handleCompleteTask(taskId);
                }
            });
        });
        
        // 削除ボタンのイベントリスナーを追加
        container.querySelectorAll('.delete-task-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const taskId = parseInt(this.getAttribute('data-task-id'));
                if (taskId) {
                    TaskDisplay.handleDeleteTask(taskId);
                }
            });
        });
    },
    
    /**
     * タスクを完了にする
     * @param {number} taskId - タスクID
     */
    handleCompleteTask: function(taskId) {
        const completeModal = document.getElementById('completeModal');
        if (completeModal) {
            completeModal.style.display = 'flex';
            const confirmBtn = document.getElementById('confirmComplete');
            if (confirmBtn) {
                // 既存のイベントリスナーを削除
                const newConfirmBtn = confirmBtn.cloneNode(true);
                confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
                newConfirmBtn.addEventListener('click', function() {
                    TaskStorage.completeTask(taskId);
                    completeModal.style.display = 'none';
                    // ページをリロードして表示を更新
                    window.location.reload();
                });
            }
        } else {
            // モーダルがない場合は直接完了
            TaskStorage.completeTask(taskId);
            window.location.reload();
        }
    },
    
    /**
     * タスクを削除する
     * @param {number} taskId - タスクID
     */
    handleDeleteTask: function(taskId) {
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.style.display = 'flex';
            const confirmBtn = document.getElementById('confirmDelete');
            if (confirmBtn) {
                // 既存のイベントリスナーを削除
                const newConfirmBtn = confirmBtn.cloneNode(true);
                confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
                newConfirmBtn.addEventListener('click', function() {
                    TaskStorage.deleteTask(taskId);
                    deleteModal.style.display = 'none';
                    // ページをリロードして表示を更新
                    window.location.reload();
                });
            }
        } else {
            // モーダルがない場合は直接削除
            TaskStorage.deleteTask(taskId);
            window.location.reload();
        }
    },
    
    /**
     * 日時をフォーマット
     * @param {string} dateString - ISO形式の日時文字列
     * @returns {string} フォーマットされた日時文字列
     */
    formatDateTime: function(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    },
    
    /**
     * HTMLエスケープ
     * @param {string} text - エスケープするテキスト
     * @returns {string} エスケープされたテキスト
     */
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

