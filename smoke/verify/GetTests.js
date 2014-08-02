var assert = require("chai").assert;
var restify = require("restify");

describe("Given a Rest Client", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");
    var client = restify.createClient({  url: configuration.target });

    describe("When GET the verify endpoint", function () {
        var response;

        before(function (done) {
            client.get(configuration.prefix + "/verify", function (err, req) {
                req.on('result', function (err, res) {
                    if (err) {
                        response = err;
                        done();
                        return;
                    }

                    response = res;
                    done();
                });
                req.end();
            });
        });
        it("Then a 200 response is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });
});
