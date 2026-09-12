import $ from "jquery";
import { expect } from "chai";
import sinon from "sinon";

import * as script from "../gentle-alerts/script";
const Modal = script.Modal;

// Module-scoped rather than hung off `this`: a module's top-level `this` is not
// a usable context object, so strict TypeScript rejects reading properties from
// it.  The fake clock is shared by every test in the "alert" suite.
let clock: sinon.SinonFakeTimers;

function resetModals() {
  $("#gentle-alerts-modal").remove();
}

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
