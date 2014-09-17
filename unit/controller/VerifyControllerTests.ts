var assert = require("chai").assert;

describe("Given a VerifyController", function () {

    var version = "1023.0213.213";
    var verifyController : controller.VerifyController = new controller.impl.VerifyControllerImpl({
        "project": "someprojectname",
        "version": version,
        "otherdata": "otherdataibe"
    });

    describe("When making a get request", function () {

        var result:model.HttpResponse;
        before(function (done) {
            verifyController.get(new model.HttpRequest())
                .then((response) => {
                    result = response;
                    done();
                });
        });
        it("Then a 200 is returned via the callback", function () {
            assert.equal(200, result.statusCode)
        });
        it("Then the expected body is returned via the callback", function () {
            assert.deepEqual(result.content, {
                "version": version
            });
        });
    });
});
