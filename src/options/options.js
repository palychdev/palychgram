(async () => {
  const defaults = {
    accent: "#7aa2ff", density: "comfortable", folderStyle: "pills", avatarRadius: 50,
    wideChat: false, forceSnow: false, hideSponsored: true, hideSimilarChannels: true,
    hideStories: false, confirmBeforeStory: true, secondsInTime: false, unroundCounters: false,
    showPeerId: true, noCopyRestrict: true, autoPause: true, blurPrivacy: false,
    blurText: false, hidePhones: false,
    expTypingOff: false, expLocalPremiumLook: false, fontScale: 100, stickerScale: 100, stickerRadius: 12,
    noAnim: false, noBlur: false, dblCopy: true, customCss: "", msgFont: "system", snippets: [], notes: ""
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
      if (lab) lab.textContent = k === "stickerRadius" ? val + "px" : val + (el.type === "range" ? "%" : "");
    });
  }
  document.getElementById("avatarRadiusVal").textContent = (cur.avatarRadius ?? 50) + "%";
  document.getElementById("fontScaleVal").textContent = (cur.fontScale ?? 100) + "%";
  document.getElementById("stickerScaleVal").textContent = (cur.stickerScale ?? 100) + "%";
  const sr = document.getElementById("stickerRadiusVal");
  if (sr) sr.textContent = (cur.stickerRadius ?? 12) + "px";
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
  let saveT = 0;
  document.getElementById("notes").addEventListener("input", (ev) => {
    clearTimeout(saveT);
    saveT = setTimeout(() => browser.storage.local.set({ notes: ev.target.value }), 600);
  });
  const renderSnips = (list) => {
    const box = document.getElementById("snipList");
    box.innerHTML = "";
    list.forEach((t, i) => {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;gap:8px;align-items:center;padding:4px 0";
      const span = document.createElement("span");
      span.textContent = t;
      span.style.cssText = "flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap";
      const del = document.createElement("button");
      del.textContent = "×";
      del.onclick = async () => {
        const cur2 = await browser.storage.local.get({ snippets: [] });
        cur2.snippets.splice(i, 1);
        await browser.storage.local.set({ snippets: cur2.snippets });
        renderSnips(cur2.snippets);
      };
      row.appendChild(span);
      row.appendChild(del);
      box.appendChild(row);
    });
  };
  renderSnips(cur.snippets || []);
  document.getElementById("snipAdd").onclick = async () => {
    const inp = document.getElementById("snipInput");
    const t = inp.value.trim();
    if (!t) return;
    const cur2 = await browser.storage.local.get({ snippets: [] });
    cur2.snippets.push(t.slice(0, 300));
    await browser.storage.local.set({ snippets: cur2.snippets });
    inp.value = "";
    renderSnips(cur2.snippets);
  };
})();
