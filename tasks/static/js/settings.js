/**
 * 設定画面用JavaScript
 */

/**
 * ナイトモードトグルの初期化
 */
function initNightModeToggle() {
    const toggleButton = document.getElementById('night-mode-toggle');
    const modeStatus = document.getElementById('mode-status');
    
    if (!toggleButton || !modeStatus) return;

    // 初期状態をローカルストレージから取得
    if (localStorage.getItem('night-mode') === 'enabled') {
        modeStatus.textContent = 'オン';
    }

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        if (document.body.classList.contains('night-mode')) {
            modeStatus.textContent = 'オン';
            localStorage.setItem('night-mode', 'enabled');
        } else {
            modeStatus.textContent = 'オフ';
            localStorage.removeItem('night-mode');
        }
    });
}

/**
 * デザイン設定ラジオボタンの初期化
 */
function initDesignRadios() {
    const designRadios = document.querySelectorAll('input[name="design"]');
    if (designRadios.length === 0) return;

    const savedDesign = localStorage.getItem('card-design') || 'sticky';
    const selectedRadio = document.querySelector(`input[value="${savedDesign}"]`);
    if (selectedRadio) {
        selectedRadio.checked = true;
    }

    designRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            localStorage.setItem('card-design', radio.value);
            // applyDesign関数がdesign_utils.jsで定義されていることを前提とする
            if (typeof applyDesign === 'function') {
                applyDesign();
            }
        });
    });
}

/**
 * アカウント削除モーダルの初期化
 */
function initDeleteAccountModal() {
    const deleteAccountModal = document.getElementById('deleteAccountModal');
    const openButton = document.getElementById('openDeleteAccountModal');
    const cancelButton = document.getElementById('cancelDeleteAccount');
    const closeButton = deleteAccountModal?.querySelector('.close-validation');
    
    if (!deleteAccountModal) return;
    
    // モーダルを開く
    if (openButton) {
        openButton.addEventListener('click', function(e) {
            e.preventDefault();
            deleteAccountModal.style.display = 'flex';
        });
    }
    
    // キャンセルボタンでモーダルを閉じる
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            deleteAccountModal.style.display = 'none';
        });
    }
    
    // 閉じるボタンでモーダルを閉じる
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            deleteAccountModal.style.display = 'none';
        });
    }
    
    // モーダル外クリックで閉じる
    deleteAccountModal.addEventListener('click', function(e) {
        if (e.target === deleteAccountModal) {
            deleteAccountModal.style.display = 'none';
        }
    });
}

/**
 * ページ読み込み時に設定画面の機能を初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initNightModeToggle();
    initDesignRadios();
    initDeleteAccountModal();
    
    // デザインを適用
    if (typeof applyDesign === 'function') {
        applyDesign();
    }
});

