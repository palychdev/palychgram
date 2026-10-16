(async () => {
  const ids = ["theme", "blurPrivacy", "wideChat", "hideSponsored", "hideStories", "confirmBeforeStory", "forceSnow", "noAnim"];
  const cur = await browser.storage.local.get({
    theme: "midnight", blurPrivacy: false, wideChat: false,
    hideSponsored: false, hideStories: false, confirmBeforeStory: true, forceSnow: false, noAnim: false,
    accent: "#7aa2ff"
  });
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.type === "checkbox") el.checked = !!cur[id];
    else el.value = cur[id];
    el.addEventListener("change", async () => {
      const v = el.type === "checkbox" ? el.checked : el.value;
      await browser.storage.local.set({ [id]: v });
    });
  }
  const presets = ["#7aa2ff", "#4ade80", "#c084fc", "#fb923c", "#f472b6", "#facc15"];
  const box = document.getElementById("swatches");
  for (const c of presets) {
    const b = document.createElement("button");
    b.className = "sw" + (cur.accent === c ? " active" : "");
    b.style.background = c;
    b.title = c;
    b.onclick = async () => {
      await browser.storage.local.set({ accent: c });
      box.querySelectorAll(".sw").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
    };
    box.appendChild(b);
  }
  document.getElementById("ver").textContent = browser.runtime.getManifest().version;
  document.getElementById("openOptions").onclick = () => browser.runtime.openOptionsPage();
})();
