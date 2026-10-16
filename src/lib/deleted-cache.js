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

  function list(limit) {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE, "readonly");
        const out = [];
        const cursor = tx.objectStore(STORE).openCursor(null, "prev");
        cursor.onsuccess = () => {
          const c = cursor.result;
          if (c && out.length < (limit || 100)) { out.push(c.value); c.continue(); }
          else resolve(out);
        };
        cursor.onerror = () => resolve(out);
      } catch (e) { resolve([]); }
    });
  }

  function clearAll() {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).clear();
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) { resolve(false); }
    });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function download() {
    list(1000).then((items) => {
      const blob = new Blob([JSON.stringify(items, null, 1)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "palychgram-deleted.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    });
  }
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function ensurePanel() {
    if (document.getElementById("pg-deleted-fab")) return;
    const fab = document.createElement("button");
    fab.id = "pg-deleted-fab";
    fab.textContent = "🗑";
    fab.title = "журнал удалённых";
    fab.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:999999;width:40px;height:40px;border-radius:50%;border:none;background:var(--pg-accent,#7aa2ff);cursor:pointer;font-size:18px";
    fab.onclick = async () => {
      const items = await list(100);
      const body = items.length
        ? items.map((i) => `<div style="border-bottom:1px solid #333;padding:6px 0"><small>${new Date(i.ts).toLocaleString()}</small><div>${escapeHtml(i.text)}</div></div>`).join("")
        : "<p>пусто. сюда попадут удалённые, которые успел увидеть.</p>";
      const w = window.open("", "_blank", "width=480,height=640");
      if (!w) return;
      w.document.write(`<meta charset="utf-8"><title>удалённые</title><body style="font:13px system-ui;background:#111;color:#eee;padding:12px"><h2>удалённые (${items.length})</h2>${body}<p><button onclick="opener.PalychDeletedCache.clear().then(()=>location.reload())">очистить</button> <button onclick="opener.PalychDeletedCache.download()">скачать json</button></p></body>`);
    };
    document.body.appendChild(fab);
  }

  function start() {
    open().then((ok) => {
      if (!ok) return;
      ensurePanel();
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

  window.PalychDeletedCache = { start, list, clear: clearAll, download };
})();
