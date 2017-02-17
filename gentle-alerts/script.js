var modalHTML = '\
<div id="gentle-alerts-modal-content">\
  <!--<span class="close">&times;</span>-->\
  <p id="gentle-alerts-modal-content-text"></p>\
</div>';
var alertQueue = [];

function Modal(msg){
    this.msg = msg;
    this.modalElement = undefined;
}

// Create a modal from modalHTML and append to the bottom of the document
Modal.prototype.createModal = function createModal() {
    var span = document.createElement("span");
    span.id = "gentle-alerts-modal";
    span.innerHTML = modalHTML;
    document.documentElement.appendChild(span);
    var modalContent = document.getElementById("gentle-alerts-modal-content-text");
    modalContent.textContent = this.msg;
    this.getModal();
    this.modalElement.style.display = "block";
}

// Find and delete the modal
Modal.prototype.deleteModal = function deleteModal() {
    modal.parentNode.removeChild(this.modalElement);
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
    var modal = alertQueue.shift();
    if (modal === undefined) {
        return;
    }
    modal.createModal();
    this.registerModalClose();
}

// Set up an event to process closing the modal
Modal.prototype.registerModalClose = function registerModalClose() {
    // When the user clicks anywhere outside of the modal, close it
    var self = this;
    var originalOnclick = window.onclick;
    window.onclick = function gentleAlertsOnclick(onclickEvent) {
        var modal = self.getModal();
        var closedModal = false;
        if (onclickEvent.target === modal) {
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

function gentleAlert(msg) {
    var modal = new Modal(msg);
    alertQueue.push(modal);
    modal.generateModal();
}

window.alert = gentleAlert;
