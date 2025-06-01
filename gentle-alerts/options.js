const defaultAudioNotification = "once";
const defaultModalTimeout = 30 * 60 * 1000;

// Saves options to chrome.storage.sync.
function save_options() {
  const audioNotificationFrequency = document.getElementById("audioNotificationFrequency").value;
  const modalTimeoutMinutes = document.getElementById("modalTimeoutMinutes").value;
  const modalTimeout = modalTimeoutMinutes * 60 * 1000;
  chrome.storage.sync.set({
    audioNotificationFrequency: audioNotificationFrequency,
    modalTimeout: modalTimeout,
  }, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById("status");
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
    const modalTimeoutMinutes = Math.round(items.modalTimeout / 60 / 1000);
    document.getElementById("modalTimeoutMinutes").value = modalTimeoutMinutes;
  });
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click",
  save_options);
