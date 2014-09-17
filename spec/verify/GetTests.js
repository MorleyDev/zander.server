var assert = require("chai").assert;
var restify = require("restify");
var pkginfo = { 
    exports: { }
};

describe("Given a Rest Client", function () {
    "use strict";
    require("pkginfo")(pkginfo);

    var configuration = require(__dirname + "/../config.json");
    var client = restify.createJsonClient({  url: "http://localhost:" + configuration.port });

    describe("When GET the verify endpoint", function () {
        var response;
        var objectResponse;

        before(function (done) {
            client.get("/verify", function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected body is returned", function() {
           assert.deepEqual(objectResponse, {
               "version": pkginfo.exports.version
           });
        });
        it("Then a 200 response is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });
});
