var defaultAudioNotification = "once";
var defaultModalTimeout = 30 * 60 * 1000;

// Saves options to chrome.storage.sync.
function save_options() {
    var audioNotificationFrequency = document.getElementById("audioNotificationFrequency").value;
    var modalTimeoutMinutes = document.getElementById("modalTimeoutMinutes").value;
    var modalTimeout = modalTimeoutMinutes * 60 * 1000;
    chrome.storage.sync.set({
        audioNotificationFrequency: audioNotificationFrequency,
        modalTimeout: modalTimeout,
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById("status");
        status.textContent = "Options saved.";
        setTimeout(function() {
            status.textContent = "";
        }, 750);
    });
}

// Restore options from chrome.storage.sync
function restore_options() {
    chrome.storage.sync.get({
        audioNotificationFrequency: defaultAudioNotification,
        modalTimeout: defaultModalTimeout
    }, function(items) {
        document.getElementById("audioNotificationFrequency").value = items.audioNotificationFrequency;
        var modalTimeoutMinutes = Math.round(items.modalTimeout / 60 / 1000);
        document.getElementById("modalTimeoutMinutes").value = modalTimeoutMinutes;
    });
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click",
    save_options);
