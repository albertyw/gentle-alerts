var modalHTML = '\
<div class="gentle-alerts-modal">\
  <div class="gentle-alerts-modal-content">\
    <span class="close">&times;</span>\
    <p>Some text in the Modal..</p>\
  </div>\
</div>';

// Create a modal from modalHTML and append to the bottom of the document
function createModal(msg) {
    var span = document.createElement("span");
    span.innerHTML = modalHTML;
    document.documentElement.appendChild(span);
    var modal = getModal();
    var modalContent = modal.getElementsByTagName("p")[0];
    modalContent.textContent = msg;
    return modal;
}

// Find and delete the modal
function deleteModal() {
    var modal = getModal();
    modal.parentNode.removeChild(modal);
}

// Get the modal DOM element
function getModal() {
    var modal = document.getElementsByClassName("gentle-alerts-modal");
    return modal[0];
}

// Create, set the modal content, and show it
function generateModal(msg) {
    var modal = createModal(msg);
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
