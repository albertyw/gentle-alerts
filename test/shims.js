// These are some shims that make mocha-phantomjs support some features in
// HTML5

// Set `document.currentScript`
// https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript
document.currentScript = {
    dataset: {
        notificationAudio: "../gentle-alerts/notification.ogg"
    }
};

// Set `HTMLAudioElement`
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
var Audio = function Audio() {
};
Audio.prototype.play = function play() {
};
