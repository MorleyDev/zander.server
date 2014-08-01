var assert = require("chai").assert;
var restify = require("restify");

["head", "post", "put", "patch", "del"].forEach(function (method) {
    describe("Given a Rest Client", function () {
        "use strict";

        var configuration = require(__dirname + "/../config.json"),
            client = restify.createClient({  url: "http://localhost:" + configuration.port });

        describe("When " + method.toUpperCase() + " the existing verify endpoint", function () {
            var response;

            before(function (done) {

                client[method]("/verify", function (err, req) {
                    req.on('result', function (err, res) {
                        if (err) {
                            response = err;
                            done();
                            return;
                        }

                        res.body = "";
                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                            res.body += chunk;
                        });

                        res.on('end', function () {
                            response = res;
                            response.body = JSON.parse(response.body);
                            done();
                        });
                    });
                    req.end();
                });
            });
            it("Then a 405 response is returned", function () {
                assert.equal(response.statusCode, 405);
            });
            it("Then the response has the expected body", function () {
                assert.equal(response.body.code, "MethodNotAllowedError");
            });
        });
    });
});
