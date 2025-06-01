// Install Javascript
const s = document.createElement("script");
s.src = chrome.runtime.getURL("gentle-alerts.min.js");
s.dataset.audioNotificationFile = chrome.runtime.getURL("notification.ogg");
(document.head||document.documentElement).appendChild(s);

// Set up CSS
s.dataset["cssPath"] = chrome.runtime.getURL("gentle-alerts.css");

// Read configs
chrome.storage.sync.get({
  audioNotificationFrequency: "once",
  modalTimeout: 30 * 60 * 1000
}, function(items) {
  Object.keys(items).forEach(function (key) {
    s.dataset[key] = items[key];
  });
});
