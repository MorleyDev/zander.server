/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />

/// <reference path="../../src/controller/VerifyController.ts" />
/// <reference path="../../src/model/HttpResponse.ts" />
/// <reference path="../../src/model/HttpRequest.ts" />

var assert = require("chai").assert;

describe("Given a VerifyController", function () {

    var verifyController = new controller.VerifyController();

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
