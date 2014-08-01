var assert = require("chai").assert;
var restify = require("restify");

["get", "head", "post", "patch", "put", "del"].forEach(function (method) {
    describe("Given a Rest Client", function () {

        var configuration = require(__dirname + "/../config.json");
        var client = restify.createClient({  url: "http://localhost:" + configuration.port });

        describe("When " + method + " is performed on an endpoint that does not exist", function () {
            var response;
            const path = "/idonotexist";

            before(function (done) {
                client[method](path, function (err, req) {
                    req.on('result', function (err, res) {
                        response = res;

                        res.body = '';
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
            it("Then a 404 response is returned", function () {
                assert.equal(response.statusCode, 404);
            });
        });
    });
});
