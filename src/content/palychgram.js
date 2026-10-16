/* PalychGram content entry: применяет настройки из storage.local, вешает observers. */
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
    secondsInTime: false,
    unroundCounters: false,
    showPeerId: true,
    hideStories: false,
    folderStyle: "pills",
    wideChat: false,
    noCopyRestrict: true,
    confirmBeforeStory: true,
    expTypingOff: false,
    expLocalPremiumLook: false
  };

  async function loadSettings() {
    try {
      const got = await browser.storage.local.get(DEFAULTS);
      return Object.assign({}, DEFAULTS, got);
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
    root.style.setProperty(
      "--pg-avatar-radius",
      (s.avatarRadius === 50 ? "50%" : s.avatarRadius + "%")
    );
    if (window.PalychGhost) window.PalychGhost.apply(s);
    if (window.PalychPremiumLocal) window.PalychPremiumLocal.apply(s);
    if (window.PalychTimeFormat) window.PalychTimeFormat.apply(s);
    if (window.PalychPeerId) window.PalychPeerId.apply(s);
  }

  function watchSponsored() {
    const kill = () => {
      if (!document.documentElement.classList.contains("pg-hide-sponsored")) return;
      document
        .querySelectorAll('[class*="sponsored"], [class*="Sponsored"]')
        .forEach((el) => {
          el.style.display = "none";
        });
    };
    new MutationObserver(kill).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    kill();
  }

  function hookStoryConfirm() {
    document.addEventListener(
      "click",
      (ev) => {
        if (!document.documentElement.dataset.pgStoryConfirm) return;
        const t = ev.target.closest
          ? ev.target.closest('[class*="story"], [class*="Story"]')
          : null;
        if (t && !confirm("Открыть сторис? (PalychGram: confirm-before-story)")) {
          ev.preventDefault();
          ev.stopPropagation();
        }
      },
      true
    );
  }

  (async () => {
    const s = await loadSettings();
    applySettings(s);
    document.documentElement.dataset.pgStoryConfirm = s.confirmBeforeStory ? "1" : "";
    watchSponsored();
    hookStoryConfirm();
    if (window.PalychDeletedCache) window.PalychDeletedCache.start();
    if (window.PalychTimeFormat) window.PalychTimeFormat.start();
    if (window.PalychPeerId) window.PalychPeerId.start();
    browser.storage.onChanged.addListener((changes) => {
      const next = {};
      for (const k of Object.keys(changes)) next[k] = changes[k].newValue;
      loadSettings().then((full) => {
        applySettings(full);
        document.documentElement.dataset.pgStoryConfirm = full.confirmBeforeStory ? "1" : "";
      });
    });
  })();
})();
