var assert = require("chai").assert;
var restify = require("restify");

["head", "post", "put", "del"].forEach(function (method) {
    describe("Given a Rest Client", function () {
        "use strict";

        var configuration = require(__dirname + "/../config.json");
        var client = restify.createClient({  url: "http://localhost:" + configuration.port });

        describe("When " + method + " the existing verify endpoint", function () {
            var response;

            before(function (done) {

                client[method]("/verify", function (err, req) {
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
                    req.end();
                });
            });
            it("Then a 405 response is returned", function () {
                assert.equal(response.statusCode, 405);
            });
        });
    });
});
