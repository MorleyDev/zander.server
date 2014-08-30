var assert = require("chai").assert;
var restify = require("restify");

describe("Given a Rest Client and no credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var client;

    before(function (done) {
        client = restify.createJsonClient({  url: "http://localhost:" + configuration.port });
        done();
    });
    describe("When DELETE the project endpoint", function () {
        var response;

        before(function (done) {
            client.del("/project", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 405 Method Not Allowed response is returned", function () {
            assert.equal(response.statusCode, 405);
        });
    });
    describe("When DELETE a specific non-existent project endpoint", function () {
        var response;

        before(function (done) {
            client.del("/project/user_no_exist", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 401 Not Authenticated response is returned", function () {
            assert.equal(response.statusCode, 401);
        });
    });
});

describe("Given a Rest Client and super credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var client;
    before(function (done) {
        client = restify.createJsonClient({  url: "http://localhost:" + configuration.port });
        client.basicAuth(configuration.goduser.name, configuration.goduser.password);
        done();
    });
    describe("When DELETE an invalid project name", function () {
        var response;
        before(function (done) {
            client.del("/project/1", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Response is returned", function () {
            assert.equal(response.statusCode, 400);

        })
    })
});