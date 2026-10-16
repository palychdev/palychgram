/* Peer ID в профиле: показывает ID чата + кнопку копирования. */
(function () {
  "use strict";
  function peerIdFromUrl() {
    const m = location.hash.match(/#\/im\?p=(c|g|s)?(\d+)/);
    return m ? m[2] : null;
  }
  function ensureBadge() {
    if (!document.documentElement.dataset.pgPeerId) return;
    if (document.getElementById("pg-peer-badge")) return;
    const id = peerIdFromUrl();
    if (!id) return;
    const anchor = document.querySelector('[class*="profile" i] [class*="info" i], [class*="chat" i] [class*="header" i]');
    if (!anchor) return;
    const b = document.createElement("button");
    b.id = "pg-peer-badge";
    b.textContent = "ID " + id;
    b.title = "Нажми чтобы скопировать";
    b.style.cssText = "font-size:11px;opacity:.75;margin-left:8px;cursor:pointer";
    b.onclick = (e) => { e.stopPropagation(); try { navigator.clipboard.writeText(id); b.textContent = "ID ✓"; } catch (_) {} };
    anchor.appendChild(b);
  }
  function start() {
    setInterval(ensureBadge, 2500);
  }
  function apply(s) {}
  window.PalychPeerId = { start, apply };
})();
