/* Локальный «премиум-визуал»: ТОЛЬКО себе, серверные лимиты не трогает. */
(function () {
  "use strict";
  function apply(s) {
    document.documentElement.classList.toggle("pg-local-premium", !!s.expLocalPremiumLook);
  }
  window.PalychPremiumLocal = { apply };
})();
