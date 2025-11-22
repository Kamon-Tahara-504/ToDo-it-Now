/**
 * 色選択処理
 */

/**
 * 色選択ボタンの処理を初期化
 * @param {string} colorInputId - 色入力フィールドのID
 */
function initColorPicker(colorInputId) {
    const colorInput = document.getElementById(colorInputId);
    if (!colorInput) return;

    // 全ての色選択ボタンにイベントリスナーを追加
    document.querySelectorAll('[data-color-picker]').forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
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
    // color-inputというIDのフィールドを探す
    const colorInput = document.getElementById('color-input');
    if (colorInput) {
        initColorPicker('color-input');
    }
});

