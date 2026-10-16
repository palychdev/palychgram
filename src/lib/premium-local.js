(function () {
  "use strict";
  function apply(s) {
    document.documentElement.classList.toggle("pg-local-premium", !!s.expLocalPremiumLook);
  }
  window.PalychPremiumLocal = { apply };
})();
