(async () => {
  const defaults = {
    accent: "#7aa2ff", density: "comfortable", folderStyle: "pills", avatarRadius: 50,
    wideChat: false, forceSnow: false, hideSponsored: true, hideSimilarChannels: true,
    hideStories: false, confirmBeforeStory: true, secondsInTime: false, unroundCounters: false,
    showPeerId: true, noCopyRestrict: true, autoPause: true, blurPrivacy: false,
    expTypingOff: false, expLocalPremiumLook: false, fontScale: 100, stickerScale: 100
  };
  const cur = await browser.storage.local.get(defaults);
  for (const [k, v] of Object.entries(Object.assign({}, defaults, cur))) {
    const el = document.getElementById(k);
    if (!el) continue;
    if (el.type === "checkbox") el.checked = !!v;
    else el.value = v;
    el.addEventListener("change", async () => {
      const val = el.type === "checkbox" ? el.checked : (el.type === "range" ? Number(el.value) : el.value);
      await browser.storage.local.set({ [k]: val });
      const lab = document.getElementById(k + "Val");
      if (lab) lab.textContent = val + "%";
    });
  }
  document.getElementById("avatarRadiusVal").textContent = (cur.avatarRadius ?? 50) + "%";
  document.getElementById("fontScaleVal").textContent = (cur.fontScale ?? 100) + "%";
  document.getElementById("stickerScaleVal").textContent = (cur.stickerScale ?? 100) + "%";
  document.getElementById("exportBtn").onclick = async () => {
    const all = await browser.storage.local.get(null);
    document.getElementById("backupBox").value = JSON.stringify(all);
  };
  document.getElementById("importBtn").onclick = async () => {
    try {
      const obj = JSON.parse(document.getElementById("backupBox").value);
      await browser.storage.local.set(obj);
      location.reload();
    } catch (e) { alert("Невалидный JSON"); }
  };
})();
