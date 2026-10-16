if (typeof window.browser === "undefined" && typeof window.chrome !== "undefined") {
  const call = (fn, self, args) => new Promise((res) => fn.apply(self, [...args, res]));
  const local = window.chrome.storage.local;
  window.browser = Object.assign({}, window.chrome, {
    storage: {
      local: {
        get: (keys) => call(local.get, local, [keys]),
        set: (items) => call(local.set, local, [items]),
        remove: (keys) => call(local.remove, local, [keys])
      },
      onChanged: window.chrome.storage.onChanged
    }
  });
}
