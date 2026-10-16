(function () {
  "use strict";
  let seen = 0, gone = 0;
  const t0 = Date.now();
  function start() {
    try {
      new MutationObserver((muts) => {
        for (const m of muts) {
          for (const n of m.addedNodes || []) {
            if (n.innerText && n.innerText.trim().length > 1) seen++;
          }
          for (const n of m.removedNodes || []) {
            if (n.innerText && n.innerText.trim().length > 1) gone++;
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }
  function get() {
    return { seen, gone, min: Math.round((Date.now() - t0) / 60000) };
  }
  window.PalychStats = { start, get };
})();
