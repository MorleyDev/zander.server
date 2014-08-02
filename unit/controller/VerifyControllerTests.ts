var assert = require("chai").assert;

describe("Given a VerifyController", function () {

    var verifyController = new controller.impl.VerifyControllerImpl();

    describe("When making a get request", function() {

        var result : model.HttpResponse;
        before(function(done) {
            verifyController.get(new model.HttpRequest()).then((response) => {
                result = response;
                done();
            });
        });
        it("Then a 200 is returned via the callback", function () {
            assert.equal(200, result.statusCode)
        });
        it("Then no body is returned via the callback", function () {
            assert.isNull(result.content);
        });
    });
});
