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
            // 既存のバリデーション処理を実行
            const deadlineInput = form.querySelector('input[name="deadline"]');
            const warningModal = document.getElementById('warningModal');
            
            if (deadlineInput && deadlineInput.value && warningModal) {
                const deadlineValue = new Date(deadlineInput.value);
                const now = new Date();
                
                // 締切が現在時刻より前の場合、警告モーダルを表示
                if (deadlineValue < now) {
                    e.preventDefault();
                    warningModal.style.display = 'flex';
                    
                    // 警告モーダルの「作成する」ボタンでフォームを送信
                    const createButton = document.getElementById('createButton');
                    if (createButton) {
                        // 既存のイベントリスナーを削除するため、一度削除して再追加
                        const newCreateButton = createButton.cloneNode(true);
                        createButton.parentNode.replaceChild(newCreateButton, createButton);
                        newCreateButton.addEventListener('click', function() {
                            warningModal.style.display = 'none';
                            // preventDefaultを解除して通常の送信を実行
                            form.submit();
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
            
            // バリデーションが通った場合、通常のPOST送信を実行
            // 既存のadd_taskビューが処理し、成功時はリダイレクトでページがリロードされる
        });
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
            
            // AJAXでフォームを取得
            fetch(`/task/${taskId}/edit/`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin'
            })
            .then(response => response.text())
            .then(html => {
                // HTMLからフォーム部分を抽出
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const formElement = doc.querySelector('#taskForm');
                
                if (formElement && formContainer) {
                    // フォームをモーダル用に調整
                    const form = formElement.cloneNode(true);
                    form.id = 'editTaskForm';
                    
                    // キャンセルボタンをモーダル用に変更
                    const cancelLink = form.querySelector('a[href*="task_list"]');
                    if (cancelLink) {
                        const cancelButton = document.createElement('button');
                        cancelButton.type = 'button';
                        cancelButton.className = 'btn btn-cancel';
                        cancelButton.id = 'cancelEditTask';
                        cancelButton.innerHTML = '<i class="fas fa-times"></i> キャンセル';
                        cancelLink.parentNode.replaceChild(cancelButton, cancelLink);
                    }
                    
                    // 送信ボタンをモーダル用に調整
                    const submitButton = form.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.className = 'btn btn-create';
                        submitButton.innerHTML = '<i class="fas fa-check"></i> 保存';
                    }
                    
                    // フォームをコンテナに挿入
                    formContainer.innerHTML = '';
                    formContainer.appendChild(form);
                    
                    // ボタンをモーダルボタンエリアに移動
                    const buttons = form.querySelectorAll('.btn');
                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.className = 'modal-buttons';
                    buttons.forEach(btn => {
                        if (btn.type === 'submit' || btn.id === 'cancelEditTask') {
                            buttonsContainer.appendChild(btn);
                        }
                    });
                    form.appendChild(buttonsContainer);
                    
                    // カラーピッカーの初期化
                    if (typeof initColorPicker === 'function') {
                        initColorPicker();
                    }
                    
                    // モーダルを開く
                    editTaskModal.style.display = 'flex';
                } else {
                    console.error('フォームが見つかりませんでした');
                    if (formContainer) {
                        formContainer.innerHTML = '<p>エラー: フォームの読み込みに失敗しました</p>';
                    }
                }
            })
            .catch(error => {
                console.error('エラー:', error);
                if (formContainer) {
                    formContainer.innerHTML = '<p>エラー: フォームの読み込みに失敗しました</p>';
                }
            });
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

