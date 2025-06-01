import $ from "jquery";
import { expect } from "chai";
import sinon from "sinon";

import * as script from "../gentle-alerts/script.js";
const Modal = script.Modal;
let modal = undefined; // eslint-disable-line no-unused-vars

function resetModals() {
    modal = undefined;
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

describe("Modal.prototype.deleteModal", function() {
    beforeEach(resetModals);
    it("will not double delete", function() {
        const modal = new Modal();
        expect(modal.modalElement).to.be.undefined;
        modal.deleteModal();
        expect(modal.modalElement).to.be.undefined;
    });
});

describe("Modal.prototype.generateModal", function() {
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
        this.clock = sinon.useFakeTimers();
        resetModals();
    });
    afterEach(() => {
        this.clock.restore();
    });
    async function closeAndAssertClosed(triggerEvent) {
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
        this.clock.tick(script.modalTimeout + 10);
        expect($("#gentle-alerts-modal").length).to.equal(0);
        await closeAndAssertClosed("click");
    });
    it("will flash the title", async () => {
        const originalTitle = document.title;
        alert("alert text");
        expect(document.title).to.equal(originalTitle);
        this.clock.tick(script.flashInterval * 6.5);
        expect(document.title).to.not.equal(originalTitle);
        this.clock.tick(script.flashInterval);
        expect(document.title).to.equal(originalTitle);
        await closeAndAssertClosed("click");
    });
});
