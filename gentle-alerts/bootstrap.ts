// A type alias rather than an interface: only aliases get the implicit index
// signature that chrome.storage.sync.get's parameter type requires.
type StoredOptions = {
  audioNotificationFrequency: string;
  modalTimeout: number;
};

const defaultOptions: StoredOptions = {
  audioNotificationFrequency: "once",
  modalTimeout: 30 * 60 * 1000,
};

// Install Javascript
const s = document.createElement("script");
s.src = chrome.runtime.getURL("gentle-alerts.min.js");
s.dataset.audioNotificationFile = chrome.runtime.getURL("notification.ogg");
s.dataset["cssPath"] = chrome.runtime.getURL("gentle-alerts.css");

// Read configs before appending so script.ts sees all dataset values on load
chrome.storage.sync.get(defaultOptions, function(items) {
  (Object.keys(defaultOptions) as (keyof StoredOptions)[]).forEach(function (key) {
    s.dataset[key] = String(items[key]);
  });
  (document.head||document.documentElement).appendChild(s);
});
