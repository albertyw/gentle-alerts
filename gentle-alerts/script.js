// HTML to show the modal
export const modalHTML = "\
<div id=\"gentle-alerts-modal-content\">\
  <p id=\"gentle-alerts-modal-content-text\"></p>\
</div>";
// Global Modal value so that modal messages can be queued
let modal = undefined;
// Location to read user configs
const currentScript = document.currentScript;

// Interval to wait within a double flash
export const flashInterval = 1250;
// Interval to wait between double flashes
const flashWaitMultiple = 6;

// Time to wait until notification disappears
export let modalTimeout = 30 * 60 * 1000;

// Keys to close modals
const enterCode = "Enter";
const escapeCode = "Escape";
const spaceCode = "Space";
const closeModalCodes = [enterCode, escapeCode, spaceCode];

// getConfig function to read data attributes from the script tag
function getConfig(property, defaultValue) {
  if (currentScript && currentScript.dataset && currentScript.dataset[property]) {
    return currentScript.dataset[property];
  }
  return defaultValue;
}

// Frequency at which the audio notification sounds
// Values can be "none", "once", or "repeating"
let audioNotificationFrequency = "once";
// Location of audio file to be played during audio notification
const audioNotificationFile = getConfig("audioNotificationFile", undefined);

export function Modal(){
  this.msgQueue = [];
  this.modalElement = undefined;
}

// Add messages to the Modal queue
Modal.prototype.queueMsg = function queueMsg(msg) {
  this.msgQueue.push(msg);
  this.generateModal();
};

// Create a modal from modalHTML and append to the bottom of the document
Modal.prototype.createModal = function createModal(msg) {
  const span = document.createElement("span");
  span.id = "gentle-alerts-modal";
  span.innerHTML = modalHTML;
  document.documentElement.appendChild(span);
  const modalContent = document.getElementById("gentle-alerts-modal-content-text");
  modalContent.textContent = msg;
  this.modalElement = document.getElementById("gentle-alerts-modal");
  this.modalElement.style.display = "block";
  this.notify();
};

// Find and delete the modal
Modal.prototype.deleteModal = function deleteModal() {
  if (this.modalElement === undefined) {
    return;
  }
  this.modalElement.parentNode.removeChild(this.modalElement);
  this.modalElement = undefined;
  this.stopFlashTab();
};

// Create, set the modal content, and show it
Modal.prototype.generateModal = function generateModal() {
  if (this.modalElement) {
    return;
  }
  const msg = this.msgQueue.shift();
  if (msg === undefined) {
    return;
  }
  this.createModal(msg);
  this.registerModalClose();
};

// Set up an event to process closing the modal
Modal.prototype.registerModalClose = function registerModalClose() {
  const self = this;
  const originalCallbacks = {};
  let timeoutTimer = undefined;
  function isOnclick(onClickEvent) {
    return onClickEvent.target == self.modalElement;
  }
  function isOnKeyUp(onKeyUpEvent) {
    return closeModalCodes.indexOf(onKeyUpEvent.code) >= 0;
  }
  function generateEvent(onClickCorrect, windowEvent) {
    originalCallbacks[windowEvent] = window[windowEvent];
    const callback = function eventCallback(eventObject) {
      if (!onClickCorrect(eventObject)) {
        return;
      }
      self.deleteModal();
      Object.keys(originalCallbacks).forEach(function (key) {
        const originalCallback = originalCallbacks[key];
        window[key] = originalCallback;
      });
      clearTimeout(timeoutTimer);
      self.generateModal();
      eventObject.preventDefault();
      return false;
    };
    window[windowEvent] = callback;
  }
  // When the user clicks anywhere outside of the modal, close it
  generateEvent(isOnclick, "onclick");
  generateEvent(isOnKeyUp, "onkeyup");
  // When the modal times out, close it
  timeoutTimer = setTimeout(function callback(){
    const keyUpEvent = new KeyboardEvent("keyup", {code: escapeCode});
    window.onkeyup(keyUpEvent);
  }, modalTimeout);
};

// Start flashing tab at intervals
Modal.prototype.notify = function notify() {
  let notified = false;
  this.notification = setInterval(function flashOn() {
    const playAudio = (audioNotificationFrequency == "once" && !notified)
      || audioNotificationFrequency == "repeating";
    if (audioNotificationFile && playAudio) {
      const audio = new Audio(audioNotificationFile);
      audio.play();
    }
    notified = true;
    const originalTitle = document.title;
    document.title = originalTitle + " - Alert";
    setTimeout(function flashOff() {
      document.title = originalTitle;
    }, flashInterval);
  }, flashInterval * flashWaitMultiple);
};

// Stop flashing tab
Modal.prototype.stopFlashTab = function stopFlashTab() {
  clearInterval(this.notification);
};

function gentleAlert(msg) {
  audioNotificationFrequency = getConfig("audioNotificationFrequency", audioNotificationFrequency);
  modalTimeout = getConfig("modalTimeout", modalTimeout);
  if (modal === undefined) {
    modal = new Modal();
  }
  modal.queueMsg(msg);
}

if (typeof window !== "undefined" && window.alert != "undefined") {
  window.alert = gentleAlert;
}
