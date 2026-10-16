(async () => {
  const ids = ["theme", "blurPrivacy", "wideChat", "hideSponsored", "confirmBeforeStory"];
  const cur = await browser.storage.local.get({
    theme: "midnight", blurPrivacy: false, wideChat: false,
    hideSponsored: true, confirmBeforeStory: true
  });
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el.type === "checkbox") el.checked = !!cur[id];
    else el.value = cur[id];
    el.addEventListener("change", async () => {
      const v = el.type === "checkbox" ? el.checked : el.value;
      await browser.storage.local.set({ [id]: v });
    });
  }
})();
