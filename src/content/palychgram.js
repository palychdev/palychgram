(function () {
  "use strict";
  const DEFAULTS = {
    theme: "midnight",
    accent: "#7aa2ff",
    density: "comfortable",
    avatarRadius: 50,
    blurPrivacy: false,
    hideSponsored: true,
    hideSimilarChannels: true,
    hideStories: false,
    folderStyle: "pills",
    secondsInTime: false,
    unroundCounters: false,
    showPeerId: true,
    wideChat: false,
    noCopyRestrict: true,
    confirmBeforeStory: true,
    forceSnow: false,
    autoPause: true,
    expTypingOff: false,
    expLocalPremiumLook: false,
    fontScale: 100,
    stickerScale: 100
  };

  async function loadSettings() {
    try {
      return Object.assign({}, DEFAULTS, await browser.storage.local.get(DEFAULTS));
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function applySettings(s) {
    const root = document.documentElement;
    root.dataset.pgTheme = s.theme;
    root.dataset.pgDensity = s.density;
    root.dataset.pgFolderStyle = s.folderStyle || "pills";
    root.dataset.pgPeerId = s.showPeerId ? "1" : "";
    root.classList.toggle("pg-blur-privacy", !!s.blurPrivacy);
    root.classList.toggle("pg-wide-chat", !!s.wideChat);
    root.classList.toggle("pg-hide-sponsored", !!s.hideSponsored);
    root.classList.toggle("pg-hide-similar", !!s.hideSimilarChannels);
    root.classList.toggle("pg-hide-stories", !!s.hideStories);
    root.classList.toggle("pg-seconds-time", !!s.secondsInTime);
    root.classList.toggle("pg-no-copy-restrict", !!s.noCopyRestrict);
    root.style.setProperty("--pg-accent", s.accent || "#7aa2ff");
    root.style.setProperty("--pg-avatar-radius", (s.avatarRadius === 50 ? "50%" : s.avatarRadius + "%"));
    root.style.setProperty("--pg-font-scale", (s.fontScale || 100) / 100);
    root.style.setProperty("--pg-sticker-scale", (s.stickerScale || 100) / 100);
    if (window.PalychGhost) window.PalychGhost.apply(s);
    if (window.PalychPremiumLocal) window.PalychPremiumLocal.apply(s);
    if (window.PalychTimeFormat) window.PalychTimeFormat.apply(s);
    if (window.PalychPeerId) window.PalychPeerId.apply(s);
    if (window.PalychSnow) window.PalychSnow.apply(s);
    if (window.PalychAutoPause) window.PalychAutoPause.apply(s);
  }

  function watchSponsored() {
    const kill = () => {
      if (!document.documentElement.classList.contains("pg-hide-sponsored")) return;
      document.querySelectorAll('[class*="sponsored"], [class*="Sponsored"]').forEach((el) => {
        el.style.display = "none";
      });
    };
    new MutationObserver(kill).observe(document.documentElement, { childList: true, subtree: true });
    kill();
  }

  function hookBlurHotkey() {
    document.addEventListener("keydown", (ev) => {
      if (ev.altKey && ev.shiftKey && (ev.key === "B" || ev.key === "И" || ev.key === "b")) {
        const on = !document.documentElement.classList.contains("pg-blur-privacy");
        document.documentElement.classList.toggle("pg-blur-privacy", on);
        browser.storage.local.set({ blurPrivacy: on });
        ev.preventDefault();
      }
    });
  }

  function hookStoryConfirm() {
    document.addEventListener("click", (ev) => {
      if (!document.documentElement.dataset.pgStoryConfirm) return;
      const t = ev.target.closest ? ev.target.closest('[class*="story"], [class*="Story"]') : null;
      if (t && !confirm("Открыть сторис?")) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    }, true);
  }

  (async () => {
    const s = await loadSettings();
    applySettings(s);
    document.documentElement.dataset.pgStoryConfirm = s.confirmBeforeStory ? "1" : "";
    watchSponsored();
    hookStoryConfirm();
    hookBlurHotkey();
    if (window.PalychDeletedCache) window.PalychDeletedCache.start();
    if (window.PalychTimeFormat) window.PalychTimeFormat.start();
    if (window.PalychPeerId) window.PalychPeerId.start();
    browser.storage.onChanged.addListener(() => {
      loadSettings().then((full) => {
        applySettings(full);
        document.documentElement.dataset.pgStoryConfirm = full.confirmBeforeStory ? "1" : "";
      });
    });
  })();
})();
