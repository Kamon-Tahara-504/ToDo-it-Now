/**
 * フォームバリデーション処理
 */

/**
 * 締切日時のバリデーション処理を初期化
 * @param {string} formId - フォームのID
 * @param {string} modalId - 警告モーダルのID
 */
function initDeadlineValidation(formId, modalId) {
    const form = document.getElementById(formId);
    const warningModal = document.getElementById(modalId);
    
    if (!form || !warningModal) return;

    const closeButton = warningModal.querySelector('.close-validation');
    const createButton = document.getElementById('createButton');
    const cancelButton = document.getElementById('cancelButton');
    
    function showModal() {
        warningModal.style.display = 'flex';
    }

    function hideModal() {
        warningModal.style.display = 'none';
    }

    if (closeButton) {
        closeButton.addEventListener('click', hideModal);
    }
    
    if (cancelButton) {
        cancelButton.addEventListener('click', hideModal);
    }

    if (createButton) {
        createButton.addEventListener('click', function() {
            hideModal();
            form.submit();
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 締切日時の入力値を取得
        const deadlineInput = document.querySelector('input[name="deadline"]');
        if (!deadlineInput || !deadlineInput.value) {
            // 締切日時が入力されていない場合は送信を許可
            form.submit();
            return;
        }

        const deadlineValue = new Date(deadlineInput.value);
        const now = new Date();

        // 締切が現在時刻より前の場合
        if (deadlineValue < now) {
            showModal();
        } else {
            form.submit();
        }
    });

    // モーダルの外側をクリックしても閉じないようにする
    warningModal.addEventListener('click', function(e) {
        if (e.target === warningModal) {
            e.stopPropagation();
        }
    });
}

/**
 * ページ読み込み時にフォームバリデーションを初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('taskForm');
    if (form) {
        initDeadlineValidation('taskForm', 'warningModal');
    }
});

