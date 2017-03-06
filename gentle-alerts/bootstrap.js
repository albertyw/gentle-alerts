// Install Javascript
var s = document.createElement("script");
s.src = chrome.runtime.getURL("script.js");
(document.head||document.documentElement).appendChild(s);

// Install CSS
var c = document.createElement("link");
c.rel = "stylesheet";
c.href = chrome.runtime.getURL("gentle-alerts.css");
(document.head||document.documentElement).appendChild(c);
