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
        before(function() {
            result = verifyController.get(new model.HttpRequest())
        });
        it("Then a 200 is returned", function () {
            assert.equal(200, result.statusCode)
        });
        it("Then no body is returned", function () {
            assert.isNull(result.content);
        });
    });
});
