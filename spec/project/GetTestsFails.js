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
    describe("When GET the project endpoint", function () {
        var response;

        before(function (done) {
            client.get("/project", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 405 Method Not Allowed response is returned", function () {
            assert.equal(response.statusCode, 405);
        });
    });
    describe("When GET a specific non-existent project endpoint", function () {
        var response;

        before(function (done) {
            client.get("/project/user_no_exist", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 404 Resource Not Found response is returned", function () {
            assert.equal(response.statusCode, 404);
        });
    });
});

describe("Given a Rest Client and credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var client;
    before(function (done) {
        client = restify.createJsonClient({  url: "http://localhost:" + configuration.port });
        client.basicAuth(configuration.goduser.name, configuration.goduser.password);
        done();
    });
    describe("When GET the project endpoint", function () {
        var response;

        before(function (done) {
            client.get("/project", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 405 Method Not Allowed response is returned", function () {
            assert.equal(response.statusCode, 405);
        });
    });
    describe("When GET a specific non-existent project endpoint", function () {
        var response;

        before(function (done) {
            client.get("/project/user_no_exist", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 404 Resource Not Found response is returned", function () {
            assert.equal(response.statusCode, 404);
        });
    });
});
