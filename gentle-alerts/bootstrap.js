// Install Javascript
const s = document.createElement("script");
s.src = chrome.runtime.getURL("gentle-alerts.min.js");
s.dataset.audioNotificationFile = chrome.runtime.getURL("notification.ogg");
(document.head||document.documentElement).appendChild(s);

// Install CSS
const c = document.createElement("link");
c.rel = "stylesheet";
c.href = chrome.runtime.getURL("gentle-alerts.css");
(document.head||document.documentElement).appendChild(c);

// Read configs
chrome.storage.sync.get({
    audioNotificationFrequency: "once",
    modalTimeout: 30 * 60 * 1000
}, function(items) {
    Object.keys(items).forEach(function (key) {
        s.dataset[key] = items[key];
    });
});
