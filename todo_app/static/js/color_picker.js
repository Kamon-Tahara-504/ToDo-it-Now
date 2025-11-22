/**
 * 色選択処理
 */

/**
 * 色選択ボタンの処理を初期化
 */
function initColorPicker() {
    // 全ての色選択ボタンにイベントリスナーを追加
    document.querySelectorAll('[data-color-picker]').forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color-picker');
            const inputId = this.getAttribute('data-color-input') || 'color-input';
            const colorInput = document.getElementById(inputId);
            
            if (color && colorInput) {
                colorInput.value = color;
                // 視覚的なフィードバックを追加（オプション）
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });
    });
}

/**
 * ページ読み込み時に色選択を初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initColorPicker();
});

