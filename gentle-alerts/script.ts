// HTML to show the modal
export const modalHTML = "\
<div id=\"gentle-alerts-modal-content\">\
  <p id=\"gentle-alerts-modal-content-text\"></p>\
</div>";
// Global Modal value so that modal messages can be queued
let modal: Modal | undefined = undefined;
// Location to read user configs
const currentScript = document.currentScript;

// Interval to wait within a double flash
export const flashInterval = 1250;
// Interval to wait between double flashes
const flashWaitMultiple = 6;

// Time to wait until notification disappears
// A value of 0 disables auto-closing, as documented in options.htm
export let modalTimeout = 30 * 60 * 1000;

// Set the time to wait until the notification disappears.  Exported because ES
// module bindings are read-only for importers, so callers outside this module
// need a setter rather than assigning to the binding directly.  Values read from
// a script tag's dataset arrive as strings, so normalize to a number here.
export function setModalTimeout(value: number | string): void {
  modalTimeout = Number(value);
}

// Keys to close modals
const enterCode = "Enter";
const escapeCode = "Escape";
const spaceCode = "Space";
const closeModalCodes = [enterCode, escapeCode, spaceCode];

// The window properties that are hijacked to detect a modal-closing interaction
type WindowEventName = "onclick" | "onkeyup";
// window.onclick and window.onkeyup are declared with different event types, so
// assigning one shared handler to either needs an indexable view of window
type WindowEventHandlers = Record<WindowEventName, unknown>;

// getConfig function to read data attributes from the script tag
function getConfig<T>(property: string, defaultValue: T): string | T {
  const value = currentScript?.dataset?.[property];
  if (value) {
    return value;
  }
  return defaultValue;
}

// Track whether the CSS has already been injected
let cssInjected = false;

// Frequency at which the audio notification sounds
type AudioNotificationFrequency = "none" | "once" | "repeating";
let audioNotificationFrequency: AudioNotificationFrequency = "once";
// Location of audio file to be played during audio notification
const audioNotificationFile = getConfig("audioNotificationFile", undefined);

export class Modal {
  msgQueue: string[] = [];
  modalElement: HTMLElement | undefined = undefined;
  notification: ReturnType<typeof setInterval> | undefined = undefined;

  // Add messages to the Modal queue
  queueMsg(msg: string): void {
    this.msgQueue.push(msg);
    this.generateModal();
  }

  // Create a modal from modalHTML and append to the bottom of the document
  createModal(msg: string): void {
    const span = document.createElement("span");
    span.id = "gentle-alerts-modal";
    span.innerHTML = modalHTML;
    document.documentElement.appendChild(span);
    const modalContent = span.querySelector("#gentle-alerts-modal-content-text");
    if (modalContent) {
      modalContent.textContent = msg;
    }
    this.modalElement = span;
    this.modalElement.style.display = "block";
    this.notify();
  }

  // Find and delete the modal
  deleteModal(): void {
    if (this.modalElement === undefined) {
      return;
    }
    this.modalElement.remove();
    this.modalElement = undefined;
    this.stopFlashTab();
  }

  // Create, set the modal content, and show it
  generateModal(): void {
    if (this.modalElement) {
      return;
    }
    const msg = this.msgQueue.shift();
    if (msg === undefined) {
      return;
    }
    this.createModal(msg);
    this.registerModalClose();
  }

  // Set up an event to process closing the modal
  registerModalClose(): void {
    const originalCallbacks: Partial<WindowEventHandlers> = {};
    let timeoutTimer: ReturnType<typeof setTimeout> | undefined = undefined;
    const isOnclick = (onClickEvent: Event): boolean => {
      return onClickEvent.target === this.modalElement;
    };
    const isOnKeyUp = (onKeyUpEvent: Event): boolean => {
      return closeModalCodes.indexOf((onKeyUpEvent as KeyboardEvent).code) >= 0;
    };
    const generateEvent = (onClickCorrect: (event: Event) => boolean, windowEvent: WindowEventName) => {
      const windowHandlers = window as unknown as WindowEventHandlers;
      originalCallbacks[windowEvent] = windowHandlers[windowEvent];
      const callback = (eventObject: Event) => {
        if (!onClickCorrect(eventObject)) {
          return;
        }
        this.deleteModal();
        (Object.keys(originalCallbacks) as WindowEventName[]).forEach(function (key) {
          windowHandlers[key] = originalCallbacks[key];
        });
        clearTimeout(timeoutTimer);
        this.generateModal();
        eventObject.preventDefault();
        return false;
      };
      windowHandlers[windowEvent] = callback;
    };
    // When the user clicks anywhere outside of the modal, close it
    generateEvent(isOnclick, "onclick");
    generateEvent(isOnKeyUp, "onkeyup");
    // When the modal times out, close it.  A timeout of 0 means "never
    // auto-close" rather than setTimeout's "fire on the next tick".
    if (modalTimeout > 0) {
      timeoutTimer = setTimeout(function callback() {
        const keyUpEvent = new KeyboardEvent("keyup", {code: escapeCode});
        window.onkeyup?.(keyUpEvent);
      }, modalTimeout);
    }
  }

  // Start flashing tab at intervals
  notify(): void {
    let notified = false;
    this.notification = setInterval(function flashOn() {
      const playAudio = (audioNotificationFrequency === "once" && !notified)
        || audioNotificationFrequency === "repeating";
      if (audioNotificationFile && playAudio) {
        const audio = new Audio(audioNotificationFile);
        audio.play().catch(() => {});
      }
      notified = true;
      const originalTitle = document.title;
      document.title = originalTitle + " - Alert";
      setTimeout(function flashOff() {
        document.title = originalTitle;
      }, flashInterval);
    }, flashInterval * flashWaitMultiple);
  }

  // Stop flashing tab
  stopFlashTab(): void {
    clearInterval(this.notification);
  }
}

function gentleAlert(msg: string): void {
  const cssPath = getConfig("cssPath", "");
  if (cssPath && !cssInjected) {
    const c = document.createElement("link");
    c.rel = "stylesheet";
    c.href = cssPath;
    (document.head||document.documentElement).appendChild(c);
    cssInjected = true;
  }

  // The dataset value is unvalidated user config; an unrecognized frequency
  // simply matches none of the comparisons in notify() and plays no audio
  audioNotificationFrequency = getConfig(
    "audioNotificationFrequency",
    audioNotificationFrequency,
  ) as AudioNotificationFrequency;
  setModalTimeout(getConfig("modalTimeout", modalTimeout));
  if (modal === undefined) {
    modal = new Modal();
  }
  modal.queueMsg(msg);
}

if (typeof window !== "undefined" && typeof window.alert !== "undefined") {
  window.alert = gentleAlert;
}
