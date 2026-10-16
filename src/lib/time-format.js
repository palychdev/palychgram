/* Время с секундами + неокруглённые счётчики (12.3K -> 12345). */
(function () {
  "use strict";
  function unround(el) {
    const t = (el.textContent || "").trim();
    const m = t.match(/^(\d+(?:[.,]\d+)?)\s*([KMB])$/i);
    if (!m) return;
    const mult = { K: 1e3, M: 1e6, B: 1e9 }[m[2].toUpperCase()];
    const val = Math.round(parseFloat(m[1].replace(",", ".")) * mult);
    el.textContent = String(val);
    el.dataset.pgUnrounded = "1";
  }
  function tick() {
    if (!document.documentElement.classList.contains("pg-seconds-time")) return;
    document.querySelectorAll('[class*="time" i]:not([data-pg-sec])').forEach((el) => {
      const t = (el.textContent || "").trim();
      if (/^\d{1,2}:\d{2}$/.test(t)) {
        el.textContent = t + ":00";
        el.dataset.pgSec = "1";
      }
    });
    if (document.documentElement.dataset.pgUnround === "1") {
      document.querySelectorAll('[class*="counter" i]:not([data-pg-unrounded])').forEach(unround);
    }
  }
  function start() {
    new MutationObserver(tick).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    setInterval(tick, 2000);
  }
  function apply(s) {
    document.documentElement.dataset.pgUnround = s.unroundCounters ? "1" : "";
    tick();
  }
  window.PalychTimeFormat = { start, apply };
})();
