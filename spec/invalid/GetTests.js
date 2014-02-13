var assert = require("chai").assert;
var restify = require("restify");

describe("Given a Rest Client", function () {

    var configuration = require(__dirname + "/../config.json");
    var client = restify.createClient({  url: "http://" + configuration.host + ":" + configuration.port });

    describe("When GET an endpoint that does not exist", function () {
        var response;
        const path = "/idonotexist";

        before(function (done) {
            client.get(path, function (err, req) {
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
            });
        });
        it("Then the response has the expected body", function () {
            const body = JSON.parse(response.body);
            assert.equal(body.code, "ResourceNotFound");
            assert.equal(body.message, path + " does not exist");
        });
        it("Then a 404 response is returned", function () {
            assert.equal(response.statusCode, 404);
        });
    });
});
