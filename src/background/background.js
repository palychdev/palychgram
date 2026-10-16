/* Background: контекстные меню PalychGram. */
browser.contextMenus.create({
  id: "pg-translate",
  title: "PalychGram: перевести выделенное",
  contexts: ["selection"]
});

browser.contextMenus.create({
  id: "pg-copy-url",
  title: "PalychGram: копировать ссылку чата",
  contexts: ["page"],
  documentUrlPatterns: ["*://web.telegram.org/*"]
});

browser.contextMenus.create({
  id: "pg-copy-id",
  title: "PalychGram: копировать ID чата из ссылки",
  contexts: ["page"],
  documentUrlPatterns: ["*://web.telegram.org/*"]
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "pg-translate" && info.selectionText) {
    const q = encodeURIComponent(info.selectionText.slice(0, 500));
    await browser.tabs.create({ url: "https://translate.google.com/?sl=auto&tl=ru&text=" + q });
  }
  if (info.menuItemId === "pg-copy-url" && tab && tab.url) {
    try { await navigator.clipboard.writeText(tab.url); } catch (e) {}
  }
  if (info.menuItemId === "pg-copy-id" && tab && tab.url) {
    const m = tab.url.match(/p=(c|g|s)?(\d+)/);
    const id = m ? m[2] : tab.url;
    try { await navigator.clipboard.writeText(id); } catch (e) {}
  }
});
