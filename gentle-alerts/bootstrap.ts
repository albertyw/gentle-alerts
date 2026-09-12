import {
  configEventName,
  configRequestEventName,
  defaultOptions,
  type StoredOptions,
} from "./config";

// script.ts is injected into the page's main world straight from the manifest,
// which keeps it out of the DevTools Network list but also leaves it without
// the chrome.* APIs.  This isolated-world script is the half that can read the
// user's options, so it hands them over as a DOM event.
let options: StoredOptions | undefined = undefined;

function sendOptions(): void {
  // The audio file's URL is not a stored option, but resolving it also needs
  // chrome.*, so it travels with the options
  const config = {
    ...options,
    audioNotificationFile: chrome.runtime.getURL("notification.ogg"),
  };
  document.dispatchEvent(new CustomEvent(configEventName, {
    detail: JSON.stringify(config),
  }));
}

function loadAndSendOptions(): void {
  if (options) {
    sendOptions();
    return;
  }
  chrome.storage.sync.get(defaultOptions, function(items) {
    options = items as StoredOptions;
    sendOptions();
  });
}

// Answer script.ts whenever it asks, so neither script depends on being
// injected before the other
document.addEventListener(configRequestEventName, loadAndSendOptions);
loadAndSendOptions();
