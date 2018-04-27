// HTML to show the modal
var modalHTML = "\
<div id=\"gentle-alerts-modal-content\">\
  <p id=\"gentle-alerts-modal-content-text\"></p>\
</div>";
// Global Modal value so that modal messages can be queued
var modal = undefined;
// Location to read user configs
var currentScript = document.currentScript;

// Frequency at which the audio notification sounds
// Values can be "none", "once", or "repeating"
var audioNotificationFrequency = "once";
// Location of audio file to be played during audio notification
var audioNotificationFile = currentScript.dataset.audioNotificationFile;

// Interval to wait within a double flash
var flashInterval = 1250;
// Interval to wait between double flashes
var flashWaitMultiple = 6;

// Time to wait until notification disappears
var modalTimeout = 30 * 60 * 1000;

// Keys to close modals
var enterCode = "Enter";
var escapeCode = "Escape";
var spaceCode = "Space";
var closeModalCodes = [enterCode, escapeCode, spaceCode];

function Modal(){
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
    var span = document.createElement("span");
    span.id = "gentle-alerts-modal";
    span.innerHTML = modalHTML;
    document.documentElement.appendChild(span);
    var modalContent = document.getElementById("gentle-alerts-modal-content-text");
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
    var msg = this.msgQueue.shift();
    if (msg === undefined) {
        return;
    }
    this.createModal(msg);
    this.registerModalClose();
};

// Set up an event to process closing the modal
Modal.prototype.registerModalClose = function registerModalClose() {
    var self = this;
    var originalCallbacks = {};
    var timeoutTimer = undefined;
    function isOnclick(onClickEvent) {
        return onClickEvent.target == self.modalElement;
    }
    function isOnKeyUp(onKeyUpEvent) {
        return closeModalCodes.indexOf(onKeyUpEvent.code) >= 0;
    }
    function generateEvent(onClickCorrect, windowEvent) {
        originalCallbacks[windowEvent] = window[windowEvent];
        var callback = function eventCallback(eventObject) {
            if (!onClickCorrect(eventObject)) {
                return;
            }
            self.deleteModal();
            Object.keys(originalCallbacks).forEach(function (key) {
                var originalCallback = originalCallbacks[key];
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
        var keyUpEvent = new KeyboardEvent("keyup", {code: escapeCode});
        window.onkeyup(keyUpEvent);
    }, modalTimeout);
};

// Start flashing tab at intervals
Modal.prototype.notify = function notify() {
    var notified = false;
    this.notification = setInterval(function flashOn() {
        var playAudio = (audioNotificationFrequency == "once" && !notified)
            || audioNotificationFrequency == "repeating";
        if (audioNotificationFile && playAudio) {
            var audio = new Audio(audioNotificationFile);
            audio.play();
        }
        notified = true;
        var originalTitle = document.title;
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
    audioNotificationFrequency = currentScript.dataset.audioNotificationFrequency;
    modalTimeout = currentScript.dataset.modalTimeout || modalTimeout;
    if (modal === undefined) {
        modal = new Modal();
    }
    modal.queueMsg(msg);
}

if (typeof window !== "undefined" && window.alert != "undefined") {
    window.alert = gentleAlert;
}
