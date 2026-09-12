import $ from "jquery";
import { expect } from "chai";
import sinon from "sinon";

import { configEventName, defaultOptions } from "../gentle-alerts/config";
import * as script from "../gentle-alerts/script";
const Modal = script.Modal;

// Deliver options the way bootstrap.ts does, over a DOM event with a JSON
// string detail, so the tests exercise the real cross-world handoff
function sendConfig(detail: unknown) {
  document.dispatchEvent(new CustomEvent(configEventName, {detail: detail}));
}

// Module-scoped rather than hung off `this`: a module's top-level `this` is not
// a usable context object, so strict TypeScript rejects reading properties from
// it.  The fake clock is shared by every test in the "alert" suite.
let clock: sinon.SinonFakeTimers;

function resetModals() {
  $("#gentle-alerts-modal").remove();
}

// Runs first on purpose: script.ts is injected at document_start and overrides
// window.alert immediately, so an alert can fire before bootstrap.ts has read
// chrome.storage and sent any config.  This suite is the only point in the file
// where no config event has been delivered yet.
describe("alerts fired before any config arrives", function() {
  beforeEach(resetModals);
  it("uses the default options", async function() {
    expect(script.modalTimeout).to.equal(defaultOptions.modalTimeout);
    alert("alert text");
    expect($("#gentle-alerts-modal-content-text").text()).to.equal("alert text");
    expect(script.modalTimeout).to.equal(defaultOptions.modalTimeout);
    await Promise.resolve($("#gentle-alerts-modal").trigger("click"));
  });
});

describe("modalHTML", function() {
  beforeEach(resetModals);
  it("should be available", function() {
    expect(script.modalHTML).to.have.length.above(0);
  });
});

describe("Modal", function() {
  beforeEach(resetModals);
  it("can be initialized", function() {
    const modal = new Modal();
    expect(modal.msgQueue).to.have.lengthOf(0);
    expect(modal.modalElement).to.be.undefined;
  });
});

describe("Modal.deleteModal", function() {
  beforeEach(resetModals);
  it("will not double delete", function() {
    const modal = new Modal();
    expect(modal.modalElement).to.be.undefined;
    modal.deleteModal();
    expect(modal.modalElement).to.be.undefined;
  });
});

describe("Modal.generateModal", function() {
  beforeEach(resetModals);
  it("will not double generate", function() {
    const modal = new Modal();
    modal.queueMsg("test 1");
    modal.queueMsg("test 2");
    expect(modal.msgQueue).to.have.lengthOf(1);
    modal.generateModal();
    expect(modal.msgQueue).to.have.lengthOf(1);
  });
});

describe("alert", function() {
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    resetModals();
  });
  afterEach(() => {
    clock.restore();
  });
  async function closeAndAssertClosed(triggerEvent: string | JQuery.Event) {
    await Promise.resolve($("#gentle-alerts-modal").trigger(triggerEvent));
    expect($("#gentle-alerts-modal-content-text").length).to.equal(0);
    expect($("#gentle-alerts-modal").length).to.equal(0);
  }
  it("can show modal", async function() {
    alert("alert text");
    expect($("#gentle-alerts-modal-content-text").length).to.equal(1);
    expect($("#gentle-alerts-modal-content-text").text()).to.equal("alert text");
    await closeAndAssertClosed("click");
  });
  it("can hide the modal with a click", async function() {
    alert("alert text");
    await closeAndAssertClosed("click");
  });
  it("can queue and show two modals", async function() {
    alert("alert test 1");
    alert("alert test 2");
    expect($("#gentle-alerts-modal").length).to.equal(1);
    expect($("#gentle-alerts-modal-content-text").text()).to.equal("alert test 1");
    await Promise.resolve($("#gentle-alerts-modal").trigger("click"));
    expect($("#gentle-alerts-modal").length).to.equal(1);
    expect($("#gentle-alerts-modal-content-text").text()).to.equal("alert test 2");
    await closeAndAssertClosed("click");
  });
  it("will not hide the modal when the modal itself is clicked", async function() {
    alert("alert text");
    await Promise.resolve($("#gentle-alerts-modal-content").trigger("click"));
    expect($("#gentle-alerts-modal-content-text").length).to.equal(1);
    expect($("#gentle-alerts-modal-content-text").text()).to.equal("alert text");
    await closeAndAssertClosed("click");
  });
  it("can hide the modal with a keypress", async function() {
    alert("alert text");
    const e = $.Event("keyup", {code: "Space"});
    await closeAndAssertClosed(e);
  });
  it("can hide the modal after a timeout", async () => {
    alert("alert text");
    clock.tick(script.modalTimeout + 10);
    expect($("#gentle-alerts-modal").length).to.equal(0);
    await closeAndAssertClosed("click");
  });
  it("will not auto-close the modal when modalTimeout is 0", async () => {
    const originalTimeout = script.modalTimeout;
    script.setModalTimeout(0);
    try {
      alert("alert text");
      expect($("#gentle-alerts-modal").length).to.equal(1);
      clock.tick(60 * 60 * 1000);
      expect($("#gentle-alerts-modal").length).to.equal(1);
      await closeAndAssertClosed("click");
    } finally {
      script.setModalTimeout(originalTimeout);
    }
  });
  it("will flash the title", async () => {
    const originalTitle = document.title;
    alert("alert text");
    expect(document.title).to.not.equal(originalTitle);
    clock.tick(script.flashInterval);
    expect(document.title).to.equal(originalTitle);
    clock.tick(script.flashInterval * 5.5);
    expect(document.title).to.not.equal(originalTitle);
    clock.tick(script.flashInterval);
    expect(document.title).to.equal(originalTitle);
    await closeAndAssertClosed("click");
  });
});

describe("CSS", function() {
  beforeEach(resetModals);
  function modalStyles() {
    return Array.from(document.querySelectorAll("style"))
      .filter((style) => (style.textContent ?? "").includes("#gentle-alerts-modal"));
  }
  it("is injected once, on the first alert", async function() {
    alert("alert text");
    await Promise.resolve($("#gentle-alerts-modal").trigger("click"));
    alert("alert text");
    await Promise.resolve($("#gentle-alerts-modal").trigger("click"));
    expect(modalStyles()).to.have.lengthOf(1);
  });
});

describe("audio notification", function() {
  let playCount: number;
  let originalAudio: typeof Audio;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    resetModals();
    playCount = 0;
    originalAudio = window.Audio;
    window.Audio = class {
      play() {
        playCount += 1;
        return Promise.resolve();
      }
    } as unknown as typeof Audio;
    script.setAudioNotificationFile("notification.ogg");
  });
  afterEach(() => {
    window.Audio = originalAudio;
    script.setAudioNotificationFile(undefined);
    clock.restore();
  });
  it("will play as soon as the alert is intercepted", async () => {
    alert("alert text");
    expect(playCount).to.equal(1);
    await Promise.resolve($("#gentle-alerts-modal").trigger("click"));
  });
  it("will play only once while the modal stays open", async () => {
    alert("alert text");
    clock.tick(script.flashInterval * 20);
    expect(playCount).to.equal(1);
    await Promise.resolve($("#gentle-alerts-modal").trigger("click"));
  });
});

describe("config", function() {
  let originalModalTimeout: number;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    resetModals();
    originalModalTimeout = script.modalTimeout;
  });
  afterEach(async () => {
    sendConfig(JSON.stringify({modalTimeout: originalModalTimeout}));
    alert("restore config");
    await Promise.resolve($("#gentle-alerts-modal").trigger("click"));
    clock.restore();
  });
  async function alertAndClose() {
    alert("alert text");
    await Promise.resolve($("#gentle-alerts-modal").trigger("click"));
  }
  it("applies options sent from the isolated world", async () => {
    sendConfig(JSON.stringify({modalTimeout: 1234}));
    await alertAndClose();
    expect(script.modalTimeout).to.equal(1234);
  });
  it("ignores a detail that is not a string", async () => {
    sendConfig({modalTimeout: 1234});
    await alertAndClose();
    expect(script.modalTimeout).to.equal(originalModalTimeout);
  });
  it("ignores a detail that is not valid JSON", async () => {
    sendConfig("not json");
    await alertAndClose();
    expect(script.modalTimeout).to.equal(originalModalTimeout);
  });
  it("ignores a detail that is not a JSON object", async () => {
    sendConfig("42");
    await alertAndClose();
    expect(script.modalTimeout).to.equal(originalModalTimeout);
  });
});
