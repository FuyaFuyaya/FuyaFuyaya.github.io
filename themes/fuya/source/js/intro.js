document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const enterBtn = document.getElementById('enter-btn');
  const autoDismissTime = 4200; // 自動跳過的時間 (毫秒)
  let timer = null;

  // 動畫播放期間鎖定頁面捲動
  body.style.overflow = 'hidden';

  // 關閉開場動畫並進入網站主體
  const dismissIntro = () => {
    if (body.classList.contains('intro-done')) return;

    body.classList.add('intro-done');
    body.style.overflow = ''; // 恢復捲動

    if (timer) {
      clearTimeout(timer);
    }
  };

  // 點擊 ENTER 按鈕手動跳過
  if (enterBtn) {
    enterBtn.addEventListener('click', dismissIntro);
  }

  // 時間到自動跳過
  timer = setTimeout(dismissIntro, autoDismissTime);
});