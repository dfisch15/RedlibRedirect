"use strict";

function waitForSelector(selector, timeoutMs) {
  return new Promise((resolve) => {
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const root = document.documentElement || document.body;
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearTimeout(timer);
        observer.disconnect();
        resolve(el);
      }
    });
    observer.observe(root, { childList: true, subtree: true });

    const timer = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeoutMs);
  });
}

// A plain location.reload() re-requests the exact same URL, which a cache
// (the browser's own, or the instance's CDN) can serve straight from a copy
// rendered before the cookies existed.
function reloadFresh() {
  const sep = location.search ? "&" : "?";
  location.replace(location.pathname + location.search + sep + "_rlgate=" + Date.now() + location.hash);
}

async function maybeApplyPrefs() {
  if (sessionStorage.getItem("rl-prefs-applied")) return;

  let cfg;
  try {
    cfg = await browser.storage.local.get({ prefsString: "", regularWindows: false });
  } catch (e) {
    return;
  }
  if (!browser.extension.inIncognitoContext && !cfg.regularWindows) return;
  if (!cfg.prefsString) return;

  // 15s covers a slow proof-of-work challenge
  const ready = await waitForSelector('a[href="/settings"]', 15000);
  if (!ready) return;

  try {
    await fetch(location.origin + "/settings/encoded-restore", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "encoded_prefs=" + encodeURIComponent(cfg.prefsString)
    });
  } catch (e) {
    return;
  }

  sessionStorage.setItem("rl-prefs-applied", "1");
  reloadFresh();
}

maybeApplyPrefs();
