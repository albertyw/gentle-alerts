var originalOnclick = window.onclick;
var modalHTML = '\
<!-- The Modal -->\
<div class="gentle-alerts-modal">\
\
  <!-- Modal content -->\
  <div class="gentle-alerts-modal-content">\
    <span class="close">&times;</span>\
    <p>Some text in the Modal..</p>\
  </div>\
\
</div>';

function getModal() {
    var modal = document.getElementsByClassName("gentle-alerts-modal");
    return modal[0];
}

function generateModal(msg) {
    var span = document.createElement("span");
    span.innerHTML = modalHTML;
    document.documentElement.appendChild(span);
    var modal = getModal();
    var modalContent = modal.getElementsByTagName("p")[0];
    console.log(modalContent);
    modalContent.textContent = msg;
    modal.style.display = "block";
    registerModalClose();
    return span;
}

function registerModalClose() {
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function gentleAlertsOnclick(onclickEvent) {
        var modal = getModal();
        if (onclickEvent.target == modal) {
            modal.style.display = "none";
        }
        if (originalOnclick) {
            originalOnclick(onclickEvent);
        }
    };
}

function modalAlert(msg) {
    generateModal(msg);
}


window.alert = modalAlert;
