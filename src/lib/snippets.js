(function () {
  "use strict";
  let items = [];

  function paste(text) {
    const ed = document.activeElement && document.activeElement.isContentEditable
      ? document.activeElement
      : document.querySelector('[contenteditable="true"]');
    if (ed) {
      try {
        ed.focus();
        if (document.execCommand("insertText", false, text)) return true;
      } catch (e) {}
    }
    try { navigator.clipboard.writeText(text); } catch (e) {}
    return false;
  }

  function ensureFab() {
    if (document.getElementById("pg-snip-fab") || !items.length) return;
    const fab = document.createElement("button");
    fab.id = "pg-snip-fab";
    fab.textContent = "⚡";
    fab.title = "шаблоны";
    fab.style.cssText = "position:fixed;right:16px;bottom:64px;z-index:999999;width:40px;height:40px;border-radius:50%;border:none;background:#242936;color:#e8eaf0;cursor:pointer;font-size:18px";
    fab.onclick = () => {
      const old = document.getElementById("pg-snip-panel");
      if (old) { old.remove(); return; }
      const p = document.createElement("div");
      p.id = "pg-snip-panel";
      p.style.cssText = "position:fixed;right:64px;bottom:64px;z-index:999999;background:#171a22;border:1px solid #2b3140;border-radius:10px;padding:8px;max-width:260px";
      items.forEach((t) => {
        const b = document.createElement("button");
        b.textContent = t.length > 40 ? t.slice(0, 40) + "…" : t;
        b.title = t;
        b.style.cssText = "display:block;width:100%;text-align:left;background:#101218;color:#e8eaf0;border:1px solid #2b3140;border-radius:8px;padding:6px;margin-bottom:6px;cursor:pointer";
        b.onclick = () => { paste(t); p.remove(); };
        p.appendChild(b);
      });
      document.body.appendChild(p);
    };
    document.body.appendChild(fab);
  }

  function apply(s) {
    items = Array.isArray(s.snippets) ? s.snippets.filter(Boolean).slice(0, 30) : [];
    if (!items.length) {
      const f = document.getElementById("pg-snip-fab");
      if (f) f.remove();
      const p = document.getElementById("pg-snip-panel");
      if (p) p.remove();
      return;
    }
    try { ensureFab(); } catch (e) {}
  }

  window.PalychSnippets = { apply };
})();
