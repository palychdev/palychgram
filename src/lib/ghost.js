/* Ghost-эксперименты: выкл. по умолчанию. Честно: полного невидимого online при переписке нет. */
(function () {
  "use strict";
  function apply(s) {
    document.documentElement.dataset.pgTypingOff = s.expTypingOff ? "1" : "";
    if (s.expTypingOff) console.warn("[PalychGram] expTypingOff включён: экспериментально, может сломаться при обновлении Telegram Web.");
  }
  window.PalychGhost = { apply };
})();
