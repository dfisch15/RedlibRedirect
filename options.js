"use strict";

const DEFAULTS = {
  instance: "https://safereddit.com",
  prefsString: ""
};

const status = document.getElementById("status");
const prefsBox = document.getElementById("prefsString");
const saveBtn = document.getElementById("saveBtn");
const radios = Array.from(document.querySelectorAll('input[name="instance"]'));

let statusTimer = null;

function flashSaved() {
  status.classList.add("show");
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => status.classList.remove("show"), 1200);
}

function load() {
  browser.storage.local
    .get(DEFAULTS)
    .then((cfg) => {
      const match = radios.find((r) => r.value === cfg.instance);
      (match || radios[0]).checked = true;
      prefsBox.value = cfg.prefsString;
    })
    .catch(() => {
      radios[0].checked = true;
    });
}

function save() {
  const picked = radios.find((r) => r.checked);
  browser.storage.local
    .set({
      instance: picked ? picked.value : DEFAULTS.instance,
      prefsString: prefsBox.value.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, "")
    })
    .then(flashSaved)
    .catch(() => {
      status.textContent = "Could not save. Check that storage is available.";
      status.classList.add("show");
    });
}

saveBtn.addEventListener("click", save);

load();
