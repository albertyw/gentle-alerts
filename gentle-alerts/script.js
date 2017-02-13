var modalHTML = '\
<div id="gentle-alerts-modal">\
  <div id="gentle-alerts-modal-content">\
    <span class="close">&times;</span>\
    <p id="gentle-alerts-modal-content-text"></p>\
  </div>\
</div>';

// Create a modal from modalHTML and append to the bottom of the document
function createModal(msg) {
    var span = document.createElement("span");
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
function generateModal(msg) {
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
        if (onclickEvent.target == modal) {
            deleteModal();
            window.onclick = originalOnclick;
        }
        if (originalOnclick) {
            originalOnclick(onclickEvent);
        }
    };
}

window.alert = generateModal;
