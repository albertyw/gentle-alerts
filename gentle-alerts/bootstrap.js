// Install Javascript
var s = document.createElement("script");
s.src = chrome.runtime.getURL("script.min.js");
s.dataset.notificationAudio = chrome.runtime.getURL("notification.ogg");
(document.head||document.documentElement).appendChild(s);

// Install CSS
var c = document.createElement("link");
c.rel = "stylesheet";
c.href = chrome.runtime.getURL("gentle-alerts.css");
(document.head||document.documentElement).appendChild(c);

// Read configs
chrome.storage.sync.get({
    audioNotification: "once"
}, function(items) {
    Object.keys(items).forEach(function (key) {
        s.dataset[key] = items[key];
    });
});
