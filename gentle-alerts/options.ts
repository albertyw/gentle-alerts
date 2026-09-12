const defaultAudioNotification = "once";
const defaultModalTimeout = 30 * 60 * 1000;

// The options page owns options.htm, so these elements are always present; the
// lookups are typed rather than asserted so a future template edit fails loudly
// here instead of throwing on a null property access.
function getInput(id: string): HTMLInputElement | HTMLSelectElement | null {
  const element = document.getElementById(id);
  if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
    return element;
  }
  return null;
}

// Saves options to chrome.storage.sync.
function save_options() {
  const audioNotificationFrequencyInput = getInput("audioNotificationFrequency");
  const modalTimeoutMinutesInput = getInput("modalTimeoutMinutes");
  if (!audioNotificationFrequencyInput || !modalTimeoutMinutesInput) {
    return;
  }
  const audioNotificationFrequency = audioNotificationFrequencyInput.value;
  const modalTimeout = Number(modalTimeoutMinutesInput.value) * 60 * 1000;
  chrome.storage.sync.set({
    audioNotificationFrequency: audioNotificationFrequency,
    modalTimeout: modalTimeout,
  }, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById("status");
    if (!status) {
      return;
    }
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
    modalTimeout: defaultModalTimeout,
  }, function(items) {
    const audioNotificationFrequencyInput = getInput("audioNotificationFrequency");
    const modalTimeoutMinutesInput = getInput("modalTimeoutMinutes");
    if (!audioNotificationFrequencyInput || !modalTimeoutMinutesInput) {
      return;
    }
    audioNotificationFrequencyInput.value = String(items.audioNotificationFrequency);
    const modalTimeoutMinutes = Math.round(Number(items.modalTimeout) / 60 / 1000);
    modalTimeoutMinutesInput.value = String(modalTimeoutMinutes);
  });
}
document.addEventListener("DOMContentLoaded", function() {
  restore_options();
  const save = document.getElementById("save");
  if (save) {
    save.addEventListener("click", save_options);
  }
});
