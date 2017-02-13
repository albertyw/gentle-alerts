var modalHTML = '\
<div id="gentle-alerts-modal-content">\
  <!--<span class="close">&times;</span>-->\
  <p id="gentle-alerts-modal-content-text"></p>\
</div>';
var alertQueue = [];

// Create a modal from modalHTML and append to the bottom of the document
function createModal(msg) {
    var span = document.createElement("span");
    span.id = "gentle-alerts-modal";
    span.innerHTML = modalHTML;
    document.documentElement.appendChild(span);
    var modalContent = document.getElementById("gentle-alerts-modal-content-text");
    modalContent.textContent = msg;
}

// Find and delete the modal
function deleteModal() {
    var modal = getModal();
    modal.parentNode.removeChild(modal);
}

// Get the modal DOM element
function getModal() {
    var modal = document.getElementById("gentle-alerts-modal");
    return modal;
}

// Create, set the modal content, and show it
function generateModal() {
    if (getModal()) {
        return;
    }
    var msg = alertQueue.shift();
    if (msg === undefined) {
        return;
    }
    createModal(msg);
    var modal = getModal();
    modal.style.display = "block";
    registerModalClose();
}

// Set up an event to process closing the modal
function registerModalClose() {
    // When the user clicks anywhere outside of the modal, close it
    var originalOnclick = window.onclick;
    window.onclick = function gentleAlertsOnclick(onclickEvent) {
        var modal = getModal();
        var closedModal = false;
        if (onclickEvent.target === modal) {
            deleteModal();
            window.onclick = originalOnclick;
            closedModal = true;
        }
        if (originalOnclick) {
            originalOnclick(onclickEvent);
        }
        if (closedModal) {
            generateModal();
        }
    };
}

function gentleAlert(msg) {
    alertQueue.push(msg);
    generateModal();
}

window.alert = gentleAlert;
