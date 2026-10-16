(function () {
  "use strict";
  let delayMs = 0;
  function apply(s) {
    document.documentElement.dataset.pgTypingOff = s.expTypingOff ? "1" : "";
    delayMs = Number(s.sendDelaySec || 0) * 1000;
    if (s.expTypingOff) console.warn("[PalychGram] typing-off пока только маркер, перехват сети будет позже.");
  }
  function getDelay() { return delayMs; }
  window.PalychGhost = { apply, getDelay };
})();
