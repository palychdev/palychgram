/* Ghost-эксперименты: выкл. по умолчанию.
   Честно: полного невидимого online при переписке нет — сервер ставит
   online на любой write. Здесь только безопасная часть: отложенная отправка
   (не светиться лишний раз) + флаг typing-off как маркер для будущих
   page-инжектов. Дроп readHistory/updateStatus НЕ делаем в content-контексте. */
(function () {
  "use strict";
  let delayMs = 0;
  function apply(s) {
    document.documentElement.dataset.pgTypingOff = s.expTypingOff ? "1" : "";
    delayMs = Number(s.sendDelaySec || 0) * 1000;
    if (s.expTypingOff) console.warn("[PalychGram] expTypingOff: маркер выставлен, перехват сети — только через page-инжект (волна 3).");
  }
  function getDelay() { return delayMs; }
  window.PalychGhost = { apply, getDelay };
})();
