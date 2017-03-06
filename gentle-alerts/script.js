var modalHTML = "\
<div id=\"gentle-alerts-modal-content\">\
  <!--<span class=\"close\">&times;</span>-->\
  <p id=\"gentle-alerts-modal-content-text\"></p>\
</div>";
var modal = undefined;
var flashInterval = 1250;
var flashWaitMultiple = 6;
var enterCode = 13;
var escapeCode = 27;
var spaceCode = 32;
var closeModalKeyCodes = [enterCode, escapeCode, spaceCode];
var notificationAudio = document.currentScript.dataset.notificationAudio;

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
    this.flashTab();
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
    function isOnclick(onClickEvent) {
        return onClickEvent.target == self.modalElement;
    }
    function isOnKeyUp(onKeyUpEvent) {
        return closeModalKeyCodes.indexOf(onKeyUpEvent.keyCode) >= 0;
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
            self.generateModal();
        };
        window[windowEvent] = callback;
    }
    // When the user clicks anywhere outside of the modal, close it
    generateEvent(isOnclick, "onclick");
    generateEvent(isOnKeyUp, "onkeyup");
};

// Start flashing tab at intervals
Modal.prototype.flashTab = function flashTab() {
    if (notificationAudio) {
        var audio = new Audio(notificationAudio);
        audio.play();
    }
    this.flasher = setInterval(function flashOn() {
        var originalTitle = document.title;
        document.title = originalTitle + " - Alert";
        setTimeout(function flashOff() {
            document.title = originalTitle;
        }, flashInterval);
    }, flashInterval * flashWaitMultiple);
};

// Stop flashing tab
Modal.prototype.stopFlashTab = function stopFlashTab() {
    clearInterval(this.flasher);
};

function gentleAlert(msg) {
    if (modal === undefined) {
        modal = new Modal();
    }
    modal.queueMsg(msg);
}

if (typeof window !== "undefined" && window.alert != "undefined") {
    window.alert = gentleAlert;
}
