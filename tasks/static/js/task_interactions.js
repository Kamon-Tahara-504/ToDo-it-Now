/**
 * タスクカードのインタラクション処理
 */

/**
 * タスクカードのクリック処理を初期化
 */
function initTaskCardClick() {
    document.querySelectorAll('.task-card').forEach(function(card) {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.task-actions')) {
                const details = this.querySelector('.task-details');
                if (details) {
                    if (details.style.display === 'none' || details.style.display === '') {
                        details.style.display = 'block';
                        details.style.opacity = '0';
                        setTimeout(() => {
                            details.style.opacity = '1';
                        }, 10);
                    } else {
                        details.style.opacity = '0';
                        setTimeout(() => {
                            details.style.display = 'none';
                        }, 300);
                    }
                }
            }
        });
    });

    // タスクアクションボタンのクリックイベントがカードのクリックイベントに伝播しないようにする
    document.querySelectorAll('.task-actions a, .task-actions button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

/**
 * タスク完了モーダルの処理を初期化
 */
function initCompleteModal() {
    const completeModal = document.getElementById('completeModal');
    if (!completeModal) return;

    const completeButtons = document.querySelectorAll('.btn-outline-success');
    let currentCompleteUrl = null;

    completeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            currentCompleteUrl = this.href;
            completeModal.style.display = 'flex';
        });
    });

    const confirmBtn = document.getElementById('confirmComplete');
    const cancelBtn = document.getElementById('cancelComplete');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            if (currentCompleteUrl) {
                window.location.href = currentCompleteUrl;
            }
            completeModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            completeModal.style.display = 'none';
        });
    }
}

/**
 * タスク削除モーダルの処理を初期化
 */
function initDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    if (!deleteModal) return;

    const deleteButtons = document.querySelectorAll('.btn-outline-danger');
    let currentDeleteUrl = null;

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            currentDeleteUrl = this.href;
            deleteModal.style.display = 'flex';
        });
    });

    const confirmBtn = document.getElementById('confirmDelete');
    const cancelBtn = document.getElementById('cancelDelete');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            if (currentDeleteUrl) {
                window.location.href = currentDeleteUrl;
            }
            deleteModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            deleteModal.style.display = 'none';
        });
    }
}

/**
 * 共有モーダルの処理を初期化
 */
function initShareModal() {
    const shareModal = document.getElementById('shareModal');
    if (!shareModal) return;

    const shareButtons = document.querySelectorAll('.task-actions button');
    const shareModalMessage = document.getElementById('shareModalMessage');
    const confirmButtonText = document.getElementById('confirmButtonText');
    let currentButton = null;

    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // フォーム内のボタンのみ処理
            if (button.closest('form')) {
                e.preventDefault();
                currentButton = button;
                const isShared = button.classList.contains('shared-active');
                
                if (shareModalMessage) {
                    shareModalMessage.textContent = isShared 
                        ? '・このタスクの共有を解除しますか？' 
                        : '・このタスクを共有しますか？';
                }
                
                if (confirmButtonText) {
                    confirmButtonText.textContent = isShared ? '解除する' : '共有する';
                }
                
                shareModal.style.display = 'flex';
            }
        });
    });

    const confirmBtn = document.getElementById('confirmShare');
    const cancelBtn = document.getElementById('cancelShare');
    const closeBtn = shareModal.querySelector('.close-validation');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            if (currentButton) {
                currentButton.closest('form').submit();
            }
            shareModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            shareModal.style.display = 'none';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            shareModal.style.display = 'none';
        });
    }

    // モーダル外クリックのイベントを防止
    shareModal.addEventListener('click', function(e) {
        if (e.target === shareModal) {
            e.stopPropagation();
        }
    });
}

/**
 * モーダルの閉じるボタンの処理を初期化
 */
function initModalCloseButtons() {
    document.querySelectorAll('.close-validation').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.validation-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
}

/**
 * タスク作成モーダルの処理を初期化
 */
function initCreateTaskModal() {
    const createTaskModal = document.getElementById('createTaskModal');
    if (!createTaskModal) return;

    const openButton = document.getElementById('openCreateTaskModal');
    const cancelButton = document.getElementById('cancelCreateTask');
    const closeButton = createTaskModal.querySelector('.close-validation');
    const form = document.getElementById('createTaskForm');

    // モーダルを開く
    if (openButton) {
        openButton.addEventListener('click', function(e) {
            e.preventDefault();
            createTaskModal.style.display = 'flex';
            // フォームをリセット
            if (form) {
                form.reset();
                // 色選択をリセット
                const colorInput = document.getElementById('color-input');
                if (colorInput) {
                    colorInput.value = '#ffffff';
                }
                // カラーピッカーの選択状態をリセット
                document.querySelectorAll('[data-color-picker]').forEach(btn => {
                    btn.classList.remove('selected');
                });
            }
        });
    }

    // キャンセルボタンでモーダルを閉じる
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            createTaskModal.style.display = 'none';
            // フォームをリセット
            if (form) {
                form.reset();
            }
        });
    }

    // 閉じるボタンでモーダルを閉じる
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            createTaskModal.style.display = 'none';
            // フォームをリセット
            if (form) {
                form.reset();
            }
        });
    }

    // モーダル外クリックで閉じる
    createTaskModal.addEventListener('click', function(e) {
        if (e.target === createTaskModal) {
            createTaskModal.style.display = 'none';
            // フォームをリセット
            if (form) {
                form.reset();
            }
        }
    });

    // フォーム送信処理
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 既存のバリデーション処理を実行
            const deadlineInput = form.querySelector('input[name="deadline"]');
            const warningModal = document.getElementById('warningModal');
            
            if (deadlineInput && deadlineInput.value && warningModal) {
                const deadlineValue = new Date(deadlineInput.value);
                const now = new Date();
                
                // 締切が現在時刻より前の場合、警告モーダルを表示
                if (deadlineValue < now) {
                    warningModal.style.display = 'flex';
                    
                    // 警告モーダルの「作成する」ボタンでタスクを作成
                    const createButton = document.getElementById('createButton');
                    if (createButton) {
                        // 既存のイベントリスナーを削除するため、一度削除して再追加
                        const newCreateButton = createButton.cloneNode(true);
                        createButton.parentNode.replaceChild(newCreateButton, createButton);
                        newCreateButton.addEventListener('click', function() {
                            warningModal.style.display = 'none';
                            // タスクを作成
                            createTaskFromForm();
                        });
                    }
                    
                    // 警告モーダルの「作成しない」ボタンでモーダルを閉じる
                    const cancelButton = document.getElementById('cancelButton');
                    if (cancelButton) {
                        const newCancelButton = cancelButton.cloneNode(true);
                        cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
                        newCancelButton.addEventListener('click', function() {
                            warningModal.style.display = 'none';
                        });
                    }
                    return;
                }
            }
            
            // バリデーションが通った場合、タスクを作成
            createTaskFromForm();
        });
    }
    
    /**
     * フォームからタスクを作成
     */
    function createTaskFromForm() {
        const form = document.getElementById('createTaskForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const taskData = {
            title: formData.get('title') || '',
            description: formData.get('description') || '',
            deadline: formData.get('deadline') || null,
            color: formData.get('color') || '#ffffff'
        };
        
        // セッションストレージにタスクを保存
        TaskStorage.createTask(taskData);
        
        // モーダルを閉じる
        const createTaskModal = document.getElementById('createTaskModal');
        if (createTaskModal) {
            createTaskModal.style.display = 'none';
        }
        
        // フォームをリセット
        form.reset();
        const colorInput = document.getElementById('color-input');
        if (colorInput) {
            colorInput.value = '#ffffff';
        }
        document.querySelectorAll('[data-color-picker]').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // ページをリロードして表示を更新
        window.location.reload();
    }
}

/**
 * タスク編集モーダルの処理を初期化
 */
function initEditTaskModal() {
    const editTaskModal = document.getElementById('editTaskModal');
    if (!editTaskModal) return;

    const formContainer = document.getElementById('editTaskFormContainer');
    const closeButton = editTaskModal.querySelector('.close-validation');
    let currentTaskId = null;

    // 編集ボタンクリックイベント
    document.querySelectorAll('[data-action="edit"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const taskId = this.getAttribute('data-task-id');
            if (!taskId) return;

            currentTaskId = taskId;
            
            // ローディング表示
            if (formContainer) {
                formContainer.innerHTML = '<p>読み込み中...</p>';
            }
            
            // セッションストレージからタスクを取得
            const task = TaskStorage.getTask(parseInt(taskId));
            if (!task) {
                console.error('タスクが見つかりませんでした');
                if (formContainer) {
                    formContainer.innerHTML = '<p>エラー: タスクが見つかりませんでした</p>';
                }
                return;
            }
            
            // フォームを動的に作成
            const form = document.createElement('form');
            form.id = 'editTaskForm';
            form.method = 'post';
            
            // タイトル
            const titleDiv = document.createElement('div');
            titleDiv.className = 'mb-3';
            titleDiv.innerHTML = `
                <label for="edit_title">タイトル</label>
                <input type="text" name="title" id="edit_title" class="form-control" value="${TaskDisplay.escapeHtml(task.title)}" required>
            `;
            form.appendChild(titleDiv);
            
            // メモ
            const descriptionDiv = document.createElement('div');
            descriptionDiv.className = 'mb-3';
            descriptionDiv.innerHTML = `
                <label for="edit_description">メモ</label>
                <textarea name="description" id="edit_description" class="form-control" rows="3">${TaskDisplay.escapeHtml(task.description || '')}</textarea>
            `;
            form.appendChild(descriptionDiv);
            
            // 達成期日
            const deadlineDiv = document.createElement('div');
            deadlineDiv.className = 'mb-3';
            const deadlineValue = task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '';
            deadlineDiv.innerHTML = `
                <label for="edit_deadline">達成期日</label>
                <input type="datetime-local" name="deadline" id="edit_deadline" class="form-control" value="${deadlineValue}">
            `;
            form.appendChild(deadlineDiv);
            
            // カラーピッカー（簡易版）
            const colorDiv = document.createElement('div');
            colorDiv.className = 'mb-3';
            colorDiv.innerHTML = `
                <label for="edit_color">色</label>
                <input type="color" name="color" id="edit_color" class="form-control" value="${task.color || '#ffffff'}">
            `;
            form.appendChild(colorDiv);
            
            // ボタン
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'modal-buttons';
            buttonsContainer.innerHTML = `
                <button type="submit" class="btn btn-create" id="submitEditTask">
                    <i class="fas fa-check"></i> 保存
                </button>
                <button type="button" class="btn btn-cancel" id="cancelEditTask">
                    <i class="fas fa-times"></i> キャンセル
                </button>
            `;
            form.appendChild(buttonsContainer);
            
            // フォームをコンテナに挿入
            if (formContainer) {
                formContainer.innerHTML = '';
                formContainer.appendChild(form);
            }
            
            // フォーム送信処理を追加
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // 既存のバリデーション処理を実行
                const deadlineInput = form.querySelector('input[name="deadline"]');
                const warningModal = document.getElementById('warningModal');
                
                if (deadlineInput && deadlineInput.value && warningModal) {
                    const deadlineValue = new Date(deadlineInput.value);
                    const now = new Date();
                    
                    // 締切が現在時刻より前の場合、警告モーダルを表示
                    if (deadlineValue < now) {
                        warningModal.style.display = 'flex';
                        
                        // 警告モーダルの「作成する」ボタンでタスクを更新
                        const createButton = document.getElementById('createButton');
                        if (createButton) {
                            const newCreateButton = createButton.cloneNode(true);
                            createButton.parentNode.replaceChild(newCreateButton, createButton);
                            newCreateButton.addEventListener('click', function() {
                                warningModal.style.display = 'none';
                                updateTaskFromForm(taskId);
                            });
                        }
                        
                        // 警告モーダルの「作成しない」ボタンでモーダルを閉じる
                        const cancelButton = document.getElementById('cancelButton');
                        if (cancelButton) {
                            const newCancelButton = cancelButton.cloneNode(true);
                            cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
                            newCancelButton.addEventListener('click', function() {
                                warningModal.style.display = 'none';
                            });
                        }
                        return;
                    }
                }
                
                // バリデーションが通った場合、タスクを更新
                updateTaskFromForm(taskId);
            });
            
            // モーダルを開く
            editTaskModal.style.display = 'flex';
            
            /**
             * フォームからタスクを更新
             */
            function updateTaskFromForm(taskId) {
                const editForm = document.getElementById('editTaskForm');
                if (!editForm) return;
                
                const formData = new FormData(editForm);
                const taskData = {
                    title: formData.get('title') || '',
                    description: formData.get('description') || '',
                    deadline: formData.get('deadline') || null,
                    color: formData.get('color') || '#ffffff'
                };
                
                // セッションストレージでタスクを更新
                TaskStorage.updateTask(parseInt(taskId), taskData);
                
                // モーダルを閉じる
                editTaskModal.style.display = 'none';
                if (formContainer) {
                    formContainer.innerHTML = '';
                }
                
                // ページをリロードして表示を更新
                window.location.reload();
            }
        });
    });

    // キャンセルボタンでモーダルを閉じる（動的に追加されるボタン用）
    editTaskModal.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'cancelEditTask') {
            editTaskModal.style.display = 'none';
            if (formContainer) {
                formContainer.innerHTML = '';
            }
        }
    });

    // 閉じるボタンでモーダルを閉じる
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            editTaskModal.style.display = 'none';
            if (formContainer) {
                formContainer.innerHTML = '';
            }
        });
    }

    // モーダル外クリックで閉じる
    editTaskModal.addEventListener('click', function(e) {
        if (e.target === editTaskModal) {
            editTaskModal.style.display = 'none';
            if (formContainer) {
                formContainer.innerHTML = '';
            }
        }
    });
}

/**
 * 全てのタスクインタラクションを初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initTaskCardClick();
    initCompleteModal();
    initDeleteModal();
    initShareModal();
    initCreateTaskModal();
    initEditTaskModal();
    initModalCloseButtons();
});

