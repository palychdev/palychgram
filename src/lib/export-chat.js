(function () {
  "use strict";
  function collect() {
    const out = [];
    document.querySelectorAll('[class*="message" i]').forEach((m) => {
      const t = m.innerText ? m.innerText.trim() : "";
      if (t) out.push(t);
    });
    return out;
  }
  function download() {
    const lines = collect();
    if (!lines.length) return;
    const blob = new Blob([lines.join("\n\n---\n\n")], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "chat-export.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }
  function ensureFab() {
    if (document.getElementById("pg-exp-fab")) return;
    const fab = document.createElement("button");
    fab.id = "pg-exp-fab";
    fab.textContent = "💾";
    fab.title = "скачать видимые сообщения";
    fab.style.cssText = "position:fixed;right:16px;bottom:112px;z-index:999999;width:40px;height:40px;border-radius:50%;border:none;background:#242936;color:#e8eaf0;cursor:pointer;font-size:18px";
    fab.onclick = download;
    try { document.body.appendChild(fab); } catch (e) {}
  }
  function apply(s) {
    if (s.chatExport === false) {
      const f = document.getElementById("pg-exp-fab");
      if (f) f.remove();
      return;
    }
    ensureFab();
  }
  window.PalychExport = { apply };
})();
