var assert = require("chai").assert;
var restify = require("restify");

describe("Given a Rest Client", function () {
    "use strict";

    var client = restify.createClient({  url: 'http://127.0.0.1:1339' });
    var response;

    describe("When GET the verify endpoint", function () {
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
