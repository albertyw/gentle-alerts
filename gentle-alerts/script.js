var modalHTML = '\
<div id="gentle-alerts-modal-content">\
  <!--<span class="close">&times;</span>-->\
  <p id="gentle-alerts-modal-content-text"></p>\
</div>';
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
    this.getModal();
    this.modalElement.style.display = "block";
}

// Find and delete the modal
Modal.prototype.deleteModal = function deleteModal() {
    this.modalElement.parentNode.removeChild(this.modalElement);
    this.modalElement = undefined;
}

// Get the modal DOM element
Modal.prototype.getModal = function getModal() {
    this.modalElement = document.getElementById("gentle-alerts-modal");
}

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
}

// Set up an event to process closing the modal
Modal.prototype.registerModalClose = function registerModalClose() {
    // When the user clicks anywhere outside of the modal, close it
    var self = this;
    var originalOnclick = window.onclick;
    window.onclick = function gentleAlertsOnclick(onclickEvent) {
        var closedModal = false;
        if (onclickEvent.target === self.modalElement) {
            self.deleteModal();
            window.onclick = originalOnclick;
            closedModal = true;
        }
        if (originalOnclick) {
            originalOnclick(onclickEvent);
        }
        if (closedModal) {
            self.generateModal();
        }
    };
}

// eslint-disable-next-line no-unused-vars
function gentleAlert(msg) {
    if (modal === undefined) {
        modal = new Modal();
    }
    modal.queueMsg(msg);
}
