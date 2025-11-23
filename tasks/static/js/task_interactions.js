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
    initModalCloseButtons();
});

