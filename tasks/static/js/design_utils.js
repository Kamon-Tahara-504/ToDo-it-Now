/**
 * デザイン関連のユーティリティ関数
 */

/**
 * 保存されているデザイン設定を適用する
 */
function applyDesign() {
    const currentDesign = localStorage.getItem('card-design') || 'sticky';
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => {
        card.classList.remove('tape-design', 'sticky-note');
        card.classList.add(currentDesign === 'tape' ? 'tape-design' : 'sticky-note');
    });
}

/**
 * ページ読み込み時にデザインを適用
 */
document.addEventListener('DOMContentLoaded', function() {
    applyDesign();
});

