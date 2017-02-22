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
