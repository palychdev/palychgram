const G = typeof globalThis !== "undefined" ? globalThis : window;
if (typeof G.browser === "undefined" && typeof G.chrome !== "undefined") {
  const call = (fn, self, args) => new Promise((res) => fn.apply(self, [...args, res]));
  const local = G.chrome.storage.local;
  G.browser = Object.assign({}, G.chrome, {
    storage: {
      local: {
        get: (keys) => call(local.get, local, [keys]),
        set: (items) => call(local.set, local, [items]),
        remove: (keys) => call(local.remove, local, [keys])
      },
      onChanged: G.chrome.storage.onChanged
    }
  });
}
