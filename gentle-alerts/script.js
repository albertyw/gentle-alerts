var modalHTML = "\
<div id=\"gentle-alerts-modal-content\">\
  <!--<span class=\"close\">&times;</span>-->\
  <p id=\"gentle-alerts-modal-content-text\"></p>\
</div>";
var modal = undefined;

function Modal(){
    this.msgQueue = [];
    this.modalElement = undefined;
}

// Add messages to the Modal queue
Modal.prototype.queueMsg = function queueMsg(msg) {
    this.msgQueue.push(msg);
    if (this.modalElement == undefined) {
        this.generateModal();
    }
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
};

// Find and delete the modal
Modal.prototype.deleteModal = function deleteModal() {
    this.modalElement.parentNode.removeChild(this.modalElement);
    this.modalElement = undefined;
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
    function isOnclick(onClickEvent) {
        return onClickEvent.target == self.modalElement;
    }
    function generateEvent(onClickCorrect, windowEvent, originalCallback) {
        return function eventCallback(eventObject) {
            if (onClickCorrect(eventObject)) {
                self.deleteModal();
                window[windowEvent] = originalCallback;
                self.generateModal();
            }
            originalCallback(eventObject);
        };
    }
    function noOp() {
        // Placeholder for when there is no built-in handler
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = generateEvent(isOnclick, "onclick", window.onclick || noOp);
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
