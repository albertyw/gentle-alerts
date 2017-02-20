// Javascript callback
function loaded() {
    if (window.alert !== gentleAlert) {
        window.alert = gentleAlert;
    }
}

// Install Javascript
var s = document.createElement("script");
s.src = chrome.extension.getURL("script.js");
s.onreadystatechange = loaded;
s.onload = loaded;
(document.head||document.documentElement).appendChild(s);

// Install CSS
var c = document.createElement("link");
c.rel = "stylesheet";
c.href = chrome.extension.getURL("gentle-alerts.css");
(document.head||document.documentElement).appendChild(c);
