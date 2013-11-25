var assert = require("chai").assert;
var restify = require("restify");

describe("Given a Rest Client", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");
    var client = restify.createClient({  url: configuration.target });

    describe("When GET the verify endpoint", function () {
        var response;

        before(function (done) {
            client.get("/verify", function (err, req) {
                req.on('result', function (err, res) {
                    if (err) {
                        throw new Error(err);
                    }
                    response = res;
                    done();
                });
            });
        });
        it("Then a 200 response is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });
});
