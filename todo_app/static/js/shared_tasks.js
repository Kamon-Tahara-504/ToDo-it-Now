/**
 * 共有タスク画面用JavaScript
 */

/**
 * 共有解除モーダルの処理を初期化
 */
function initUnshareModal() {
    const unshareModal = document.getElementById('unshareModal');
    if (!unshareModal) return;

    let currentTaskId = null;

    // 共有ボタンの処理
    document.querySelectorAll('.share-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            currentTaskId = this.dataset.taskId;
            unshareModal.style.display = 'flex';
        });
    });

    // 確認ボタンのクリックイベント
    const confirmBtn = document.getElementById('confirmUnshare');
    const cancelBtn = document.getElementById('cancelUnshare');
    const closeBtn = unshareModal.querySelector('.close-validation');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            if (currentTaskId) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/share_task/${currentTaskId}/`;
                
                const csrf = document.createElement('input');
                csrf.type = 'hidden';
                csrf.name = 'csrfmiddlewaretoken';
                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
                if (csrfToken) {
                    csrf.value = csrfToken.value;
                }
                
                form.appendChild(csrf);
                document.body.appendChild(form);
                form.submit();
            }
            unshareModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            unshareModal.style.display = 'none';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            unshareModal.style.display = 'none';
        });
    }

    // モーダル外クリックの処理
    unshareModal.addEventListener('click', function(e) {
        if (e.target === unshareModal) {
            unshareModal.style.display = 'none';
        }
    });
}

/**
 * ページ読み込み時に共有タスク画面の機能を初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initUnshareModal();
});

