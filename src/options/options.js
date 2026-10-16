(async () => {
  const defaults = { accent: "#7aa2ff", density: "comfortable", avatarRadius: 50, secondsInTime: false, hideSimilarChannels: true, noCopyRestrict: true, expTypingOff: false, expLocalPremiumLook: false };
  const cur = await browser.storage.local.get(defaults);
  for (const [k, v] of Object.entries(Object.assign({}, defaults, cur))) {
    const el = document.getElementById(k);
    if (!el) continue;
    if (el.type === "checkbox") el.checked = !!v;
    else el.value = v;
    el.addEventListener("change", async () => {
      const val = el.type === "checkbox" ? el.checked : (el.type === "range" ? Number(el.value) : el.value);
      await browser.storage.local.set({ [k]: val });
      if (k === "avatarRadius") document.getElementById("avatarRadiusVal").textContent = val + "%";
    });
  }
  document.getElementById("avatarRadiusVal").textContent = (cur.avatarRadius ?? 50) + "%";
})();
