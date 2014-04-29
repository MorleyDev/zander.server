var assert = require("chai").assert;
var restify = require("restify");

describe("Given a Rest Client", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");
    var client = restify.createClient({  url: "http://localhost:" + configuration.port });

    describe("When GET the verify endpoint", function () {
        var response;

        before(function (done) {
            client.get("/verify", function (err, req) {
                req.on('result', function (err, res) {
                    response = res;

                    res.body = "";
                    res.setEncoding('utf8');
                    res.on('data', function(chunk) {
                        res.body += chunk;
                    });

                    res.on('end', function() {
                        done();
                    });
                });
            });
        });
        it("Then has an empty body", function() {
           assert.equal(response.body, "");
        });
        it("Then a 200 response is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });
});
