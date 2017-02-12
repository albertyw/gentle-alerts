var s = document.createElement("script");
s.src = chrome.extension.getURL("script.js");
(document.head||document.documentElement).appendChild(s);

var c = document.createElement("link");
c.rel = "stylesheet";
c.href = chrome.extension.getURL("gentle-alerts.css");
(document.head||document.documentElement).appendChild(c);
