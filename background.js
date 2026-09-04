"use strict";

const INSTANCES = [
  "https://safereddit.com",
  "https://redlib.catsarch.com",
  "https://red.artemislena.eu",
  "https://redlib.privadency.com"
];

const DEFAULT_INSTANCE = INSTANCES[0];

// Matches reddit.com and any subdomain (www, old, new, np, amp, sh, m, i).
// Does NOT match redd.it, i.redd.it, v.redd.it or preview.redd.it, which are
// direct media with no redlib route.
const REDDIT_HOST = /^(?:[a-z0-9-]+\.)*reddit\.com$/i;

let instance = DEFAULT_INSTANCE;

browser.storage.local
  .get({ instance: DEFAULT_INSTANCE })
  .then((cfg) => {
    instance = cfg.instance;
  })
  .catch(() => {
  });

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.instance) {
    instance = changes.instance.newValue || DEFAULT_INSTANCE;
  }
});

function onBeforeRequest(details) {
  // Fail open: anything other than an explicit private request is left alone
  if (details.incognito !== true) return {};

  let url;
  try {
    url = new URL(details.url);
  } catch (e) {
    return {};
  }

  if (!REDDIT_HOST.test(url.hostname)) return {};

  // Fragments are never part of the request URL
  return { redirectUrl: instance + url.pathname + url.search };
}

browser.webRequest.onBeforeRequest.addListener(
  onBeforeRequest,
  { urls: ["*://*.reddit.com/*"], types: ["main_frame"] },
  ["blocking"]
);

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.incognito) return;
  if (!tab.url) return;
  if (!INSTANCES.some((origin) => tab.url.startsWith(origin))) return;

  browser.tabs.executeScript(tabId, { file: "gate.js", runAt: "document_idle" }).catch(() => {
  });
});
