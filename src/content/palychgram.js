(function () {
  "use strict";
  const DEFAULTS = {
    theme: "midnight",
    accent: "#7aa2ff",
    density: "comfortable",
    avatarRadius: 50,
    blurPrivacy: false,
    hideSponsored: false,
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
    stickerScale: 100,
    stickerRadius: 12,
    blurText: false,
    hidePhones: false,
    noAnim: false,
    noBlur: false,
    dblCopy: true,
    customCss: "",
    msgFont: "system",
    snippets: []
  };

  const THEMES = {
    midnight: { bg: "#0e1116", bg2: "#171c24", text: "#e8eaf0", text2: "#9aa3b2", borders: "#242b36", dark: true },
    amoled: { bg: "#000000", bg2: "#0a0a0a", text: "#f0f0f0", text2: "#9a9a9a", borders: "#1e1e1e", dark: true },
    snow: { bg: "#f6f7fb", bg2: "#ffffff", text: "#14161c", text2: "#5b6472", borders: "#e2e6ee", dark: false },
    forest: { bg: "#0d1512", bg2: "#131e19", text: "#e6f0e9", text2: "#93a89a", borders: "#223028", dark: true },
    grape: { bg: "#150f1e", bg2: "#1e1530", text: "#efe8fa", text2: "#a89cc4", borders: "#2c2342", dark: true },
    sunset: { bg: "#1a100c", bg2: "#241612", text: "#faeedd", text2: "#c4a894", borders: "#38241c", dark: true }
  };

  const FONTS = {
    system: "system-ui, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    mono: "ui-monospace, Consolas, monospace"
  };

  function applyTheme(s) {
    let key = s.theme;
    if (key === "auto") {
      const h = new Date().getHours();
      key = (h >= 7 && h < 21) ? "snow" : "midnight";
    }
    const t = THEMES[key] || THEMES.midnight;
    const st = document.documentElement.style;
    st.setProperty("--color-background", t.bg);
    st.setProperty("--color-background-secondary", t.bg2);
    st.setProperty("--color-text", t.text);
    st.setProperty("--color-text-secondary", t.text2);
    st.setProperty("--color-borders", t.borders);
    st.setProperty("--color-primary", s.accent || "#7aa2ff");
    document.documentElement.style.colorScheme = t.dark ? "dark" : "light";
  }

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
    root.classList.toggle("pg-blur-text", !!s.blurText);
    root.classList.toggle("pg-hide-phones", !!s.hidePhones);
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
    root.style.setProperty("--pg-sticker-radius", (s.stickerRadius ?? 12) + "px");
    root.style.setProperty("--pg-msg-font", FONTS[s.msgFont] || FONTS.system);
    root.classList.toggle("pg-no-anim", !!s.noAnim);
    root.classList.toggle("pg-no-blur", !!s.noBlur);
    root.dataset.pgDblCopy = s.dblCopy ? "1" : "";
    applyTheme(s);
    applyCustomCss(s);
    if (window.PalychGhost) window.PalychGhost.apply(s);
    if (window.PalychPremiumLocal) window.PalychPremiumLocal.apply(s);
    if (window.PalychTimeFormat) window.PalychTimeFormat.apply(s);
    if (window.PalychPeerId) window.PalychPeerId.apply(s);
    if (window.PalychSnow) window.PalychSnow.apply(s);
    if (window.PalychAutoPause) window.PalychAutoPause.apply(s);
    if (window.PalychSnippets) window.PalychSnippets.apply(s);
    if (window.PalychExport) window.PalychExport.apply(s);
  }

  function watchAds() {
    const hide = (root, sel) => {
      root.querySelectorAll(sel).forEach((el) => {
        if (el.children.length > 40) return;
        if (el.querySelector("input, textarea, video")) return;
        el.style.display = "none";
      });
    };
    const pass = () => {
      const on = document.documentElement;
      if (on.classList.contains("pg-hide-sponsored")) {
        hide(document, '[class*="sponsor" i], [class*="promo" i]');
      }
      if (on.classList.contains("pg-hide-similar")) {
        hide(document, '[class*="similar" i]');
      }
    };
    setInterval(pass, 3000);
    pass();
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

  function applyCustomCss(s) {
    let st = document.getElementById("pg-custom-css");
    if (!st) {
      st = document.createElement("style");
      st.id = "pg-custom-css";
      document.documentElement.appendChild(st);
    }
    if (st.textContent !== (s.customCss || "")) st.textContent = s.customCss || "";
  }

  function hookDblCopy() {
    document.addEventListener("dblclick", (ev) => {
      if (!document.documentElement.dataset.pgDblCopy) return;
      const m = ev.target.closest ? ev.target.closest('[class*="message" i]') : null;
      if (!m) return;
      const t = m.innerText ? m.innerText.trim() : "";
      if (t) { try { navigator.clipboard.writeText(t); } catch (e) {} }
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
    if (/[?#&]pg=off\b/.test(location.hash + " " + location.search)) {
      console.log("[pg] off");
      return;
    }
    const s = await loadSettings();
    applySettings(s);
    document.documentElement.dataset.pgStoryConfirm = s.confirmBeforeStory ? "1" : "";
    const safe = (fn) => { try { fn(); } catch (e) { console.warn("[pg]", e); } };
    safe(watchAds);
    safe(hookStoryConfirm);
    safe(hookBlurHotkey);
    safe(hookDblCopy);
    safe(() => window.PalychDeletedCache && PalychDeletedCache.start());
    safe(() => window.PalychTimeFormat && PalychTimeFormat.start());
    safe(() => window.PalychPeerId && PalychPeerId.start());
    console.log("[pg] on");
    try { if (window.PalychStats) window.PalychStats.start(); } catch (e) {}
    try {
      browser.runtime.onMessage.addListener((m) => {
        if (m && m.type === "pgStats" && window.PalychStats) return Promise.resolve(window.PalychStats.get());
      });
    } catch (e) {}
    browser.storage.onChanged.addListener(() => {
      loadSettings().then((full) => {
        applySettings(full);
        document.documentElement.dataset.pgStoryConfirm = full.confirmBeforeStory ? "1" : "";
      });
    });
  })();
})();
