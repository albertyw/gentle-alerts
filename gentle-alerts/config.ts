// The extension runs code in two JavaScript worlds: bootstrap.ts in the
// isolated world, where the chrome.* APIs live, and script.ts in the page's
// main world, where window.alert can be overridden.  They are separate webpack
// entry points, so the vocabulary they use to talk to each other lives here.

// script.ts asks for the user's options with configRequestEventName and
// bootstrap.ts answers with configEventName, whose detail is a JSON string.
// A string rather than an object because it crosses the world boundary as a
// plain clonable primitive in every browser.
export const configEventName = "gentle-alerts-config";
export const configRequestEventName = "gentle-alerts-config-request";

export type StoredOptions = {
  audioNotificationFrequency: string;
  modalTimeout: number;
};

export const defaultOptions: StoredOptions = {
  audioNotificationFrequency: "once",
  modalTimeout: 30 * 60 * 1000,
};
