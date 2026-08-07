/* ============================================
   source/js/intro.js
   首頁導入頁控制腳本
   - 同一個 session 只播放一次（sessionStorage）
   - 尊重 prefers-reduced-motion
   - 導入頁的貓咪印章，會依實際版面位置飛到 Header／Hero 的印章位置後收合
   ============================================ */
(function () {
  var STORAGE_KEY = 'fuya-intro-seen';
  var body = document.body;
  var introStage = document.getElementById('introStage');
  var introStamp = document.getElementById('introStamp');
  var heroStamp = document.getElementById('heroStamp');
  var enterBtn = document.getElementById('introEnterBtn');

  if (!introStage) { return; }

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { /* 私密瀏覽等情況忽略 */ }

  if (alreadySeen || prefersReduced) {
    body.classList.remove('intro-pending');
    body.classList.add('intro-skip');
    return;
  }

  body.classList.add('intro-pending');
  var hasEntered = false;

  function markSeen () {
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* 忽略儲存失敗 */ }
  }

  function enter () {
    if (hasEntered) { return; }
    hasEntered = true;

    // 依實際位置計算導入頁印章飛到 Header 印章的位移與縮放，讓收合動作精準落點
    if (introStamp && heroStamp) {
      var from = introStamp.getBoundingClientRect();
      var to = heroStamp.getBoundingClientRect();
      var scale = to.width / from.width;
      var tx = (to.left + to.width / 2) - (from.left + from.width / 2);
      var ty = (to.top + to.height / 2) - (from.top + from.height / 2);

      introStage.style.setProperty('--intro-tx', tx + 'px');
      introStage.style.setProperty('--intro-ty', ty + 'px');
      introStage.style.setProperty('--intro-scale', String(scale || 0.2));
      introStage.style.transform =
        'translate(var(--intro-tx), var(--intro-ty)) scale(var(--intro-scale))';
    } else {
      introStage.style.transform = 'translate(-38vw, -42vh) scale(0.16)';
    }

    introStage.classList.add('leaving');
    introStage.style.opacity = '0';

    body.classList.remove('intro-pending');
    body.classList.add('entered');
    markSeen();

    var cleared = false;
    function clearStage () {
      if (cleared) { return; }
      cleared = true;
      introStage.style.display = 'none';
    }
    introStage.addEventListener('transitionend', clearStage, { once: true });
    // 保險：若 transitionend 沒觸發（例如分頁切到背景），仍確保移除
    setTimeout(clearStage, 900);
  }

  if (enterBtn) { enterBtn.addEventListener('click', enter); }
  introStage.addEventListener('click', function (evt) {
    if (evt.target === introStage) { enter(); }
  });

  // 動畫播完後自動進入，使用者也可提早點擊按鈕跳過
  setTimeout(enter, 4000);
})();