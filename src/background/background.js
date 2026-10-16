try { if (typeof importScripts === "function") importScripts("../lib/compat.js"); } catch (e) {}
async function setup() {
  try { await browser.contextMenus.removeAll(); } catch (e) {}
  browser.contextMenus.create({
    id: "pg-translate",
    title: "перевести выделенное",
    contexts: ["selection"]
  });
  browser.contextMenus.create({
    id: "pg-copy-url",
    title: "копировать ссылку чата",
    contexts: ["page"],
    documentUrlPatterns: ["*://web.telegram.org/*"]
  });
  browser.contextMenus.create({
    id: "pg-copy-id",
    title: "копировать ID чата из ссылки",
    contexts: ["page"],
    documentUrlPatterns: ["*://web.telegram.org/*"]
  });
}

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
    try { await navigator.clipboard.writeText(m ? m[2] : tab.url); } catch (e) {}
  }
});

setup();
