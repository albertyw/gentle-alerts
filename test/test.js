var expect = chai.expect;

describe("modalHTML", function() {
    it("should be available", function() {
        expect(modalHTML).to.have.length.above(0);
    });
});

describe("Modal", function() {
    beforeEach(function() {
        modal = undefined;
        $("#gentle-alerts-modal").remove();
    });
    it("can be initialized", function() {
        var modal = new Modal();
        expect(modal.msgQueue).to.have.lengthOf(0);
        expect(modal.modalElement).to.be.undefined;
    });
});

describe("alert", function() {
    beforeEach(function() {
        modal = undefined;
        $("#gentle-alerts-modal").remove();
    });
    it("can show modal", function() {
        alert("alert text");
        expect($("#gentle-alerts-modal-content-text").length).to.equal(1);
        expect($("#gentle-alerts-modal-content-text").text()).to.equal("alert text");
    });
    it("can hide the modal", function(done) {
        alert("alert text");
        $.when($("#gentle-alerts-modal").trigger("click")).done(function(){
            expect($("#gentle-alerts-modal-content-text").length).to.equal(0);
            expect($("#gentle-alerts-modal").length).to.equal(0);
            done();
        });
    });
});
