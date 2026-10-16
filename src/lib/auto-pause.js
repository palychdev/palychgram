(function () {
  "use strict";
  function apply(s) {
    if (!s.autoPause || apply._hooked) return;
    apply._hooked = true;
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) document.querySelectorAll("video, audio").forEach((m) => { try { m.pause(); } catch (e) {} });
    });
  }
  window.PalychAutoPause = { apply };
})();
