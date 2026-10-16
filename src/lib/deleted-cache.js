/* Журнал удалённых: кэширует увиденный текст в IndexedDB, показывает панель «удалённые». */
(function () {
  "use strict";
  const DB = "palychgram";
  const STORE = "deleted";
  let db = null;

  function open() {
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
        req.onsuccess = () => { db = req.result; resolve(true); };
        req.onerror = () => resolve(false);
      } catch (e) { resolve(false); }
    });
  }

  async function save(text) {
    if (!db || !text || text.length < 2 || text.length > 4000) return;
    try {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).add({ text: text.slice(0, 4000), ts: Date.now() });
    } catch (e) {}
  }

  function start() {
    open().then((ok) => {
      if (!ok) return;
      const seen = new Set();
      new MutationObserver((muts) => {
        for (const m of muts) {
          for (const n of m.removedNodes || []) {
            const t = n.innerText ? n.innerText.trim() : "";
            if (t && !seen.has(t)) { seen.add(t); save(t); }
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    });
  }

  window.PalychDeletedCache = { start };
})();
