var defaultAudioNotification = "once";

// Saves options to chrome.storage.sync.
function save_options() {
    var audioNotificationFrequency = document.getElementById("audioNotificationFrequency").value;
    chrome.storage.sync.set({
        audioNotificationFrequency: audioNotificationFrequency
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
        audioNotificationFrequency: defaultAudioNotification
    }, function(items) {
        document.getElementById("audioNotificationFrequency").value = items.audioNotificationFrequency;
    });
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click",
    save_options);
