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
    describe("When GET the user endpoint", function () {
        var response;

        before(function (done) {
            client.get("/user", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 405 Method Not Allowed response is returned", function () {
            assert.equal(response.statusCode, 405);
        });
    });
    describe("When GET a specific non-existent user endpoint", function () {
        var response;

        before(function (done) {
            client.get("/user/user_no_exist", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 401 Not Authenticated response is returned", function () {
            assert.equal(response.statusCode, 401);
        });
    });
});

describe("Given a Rest Client and god credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var client;
    before(function (done) {
        client = restify.createJsonClient({ url:"http://localhost:" + configuration.port });
        client.basicAuth(configuration.goduser.name, configuration.goduser.password);
        done();
    });
    describe("When GET the user endpoint", function () {
        var response;

        before(function (done) {
            client.get("/user", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 405 Method Not Allowed response is returned", function () {
            assert.equal(response.statusCode, 405);
        });
    });
    describe("When GET a specific non-existing user endpoint", function () {
        var response;

        before(function (done) {
            client.get("/user/non_user", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 404 Not Found response is returned", function () {
            assert.equal(response.statusCode, 404);
        });
    });
});
