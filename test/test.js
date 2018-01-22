var expect = chai.expect;

function resetModals() {
    modal = undefined;
    $("#gentle-alerts-modal").remove();
}

describe("modalHTML", function() {
    beforeEach(resetModals);
    it("should be available", function() {
        expect(modalHTML).to.have.length.above(0);
    });
});

describe("Modal", function() {
    beforeEach(resetModals);
    it("can be initialized", function() {
        var modal = new Modal();
        expect(modal.msgQueue).to.have.lengthOf(0);
        expect(modal.modalElement).to.be.undefined;
    });
});

describe("Modal.prototype.deleteModal", function() {
    beforeEach(resetModals);
    it("will not double delete", function() {
        var modal = new Modal();
        expect(modal.modalElement).to.be.undefined;
        modal.deleteModal();
        expect(modal.modalElement).to.be.undefined;
    });
});

describe("Modal.prototype.generateModal", function() {
    beforeEach(resetModals);
    it("will not double generate", function() {
        var modal = new Modal();
        modal.queueMsg("test 1");
        modal.queueMsg("test 2");
        expect(modal.msgQueue).to.have.lengthOf(1);
        modal.generateModal();
        expect(modal.msgQueue).to.have.lengthOf(1);
    });
});

describe("alert", function() {
    beforeEach(resetModals);
    function closeAndAssertClosed(triggerEvent, done) {
        $.when($("#gentle-alerts-modal").trigger(triggerEvent)).done(function(){
            expect($("#gentle-alerts-modal-content-text").length).to.equal(0);
            expect($("#gentle-alerts-modal").length).to.equal(0);
            done();
        });
    }
    it("can show modal", function() {
        alert("alert text");
        expect($("#gentle-alerts-modal-content-text").length).to.equal(1);
        expect($("#gentle-alerts-modal-content-text").text()).to.equal("alert text");
    });
    it("can hide the modal with a click", function(done) {
        alert("alert text");
        closeAndAssertClosed("click", done);
    });
    it("can queue and show two modals", function(done) {
        alert("alert test 1");
        alert("alert test 2");
        expect($("#gentle-alerts-modal").length).to.equal(1);
        expect($("#gentle-alerts-modal-content-text").text()).to.equal("alert test 1");
        $.when($("#gentle-alerts-modal").trigger("click")).done(function(){
            expect($("#gentle-alerts-modal").length).to.equal(1);
            expect($("#gentle-alerts-modal-content-text").text()).to.equal("alert test 2");
            closeAndAssertClosed("click", done);
        });
    });
    it("will not hide the modal when the modal itself is clicked", function(done) {
        alert("alert text");
        $.when($("#gentle-alerts-modal-content").trigger("click")).done(function(){
            expect($("#gentle-alerts-modal-content-text").length).to.equal(1);
            expect($("#gentle-alerts-modal-content-text").text()).to.equal("alert text");
            done();
        });
    });
    it("can hide the modal with a keypress", function(done) {
        alert("alert text");
        var e = jQuery.Event("keyup", {code: "Space"});
        closeAndAssertClosed(e, done);
    });
    it("will flash the title", function(done) {
        var originalFlashInterval = flashInterval;
        flashInterval = 5;
        var originalTitle = document.title;
        alert("alert text");
        expect(document.title).to.equal(originalTitle);
        setTimeout(function() {
            expect(document.title).to.not.equal(originalTitle);
            setTimeout(function() {
                expect(document.title).to.equal(originalTitle);
                flashInterval = originalFlashInterval;
                done();
            }, flashInterval);
        }, flashInterval * 6.5);
    });
});
