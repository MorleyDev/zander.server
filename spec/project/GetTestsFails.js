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
    describe("When GET an invalid project endpoint", function () {
        var response;

        before(function (done) {
            client.get("/project/1", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    
    describe("When GET the project endpoint with a negative start index", function () {
        var response;

        before(function (done) {
            client.get("/project?start=-11", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When GET the project endpoint with a non-numeric start index", function () {
        var response;

        before(function (done) {
            client.get("/project?start=abc", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    
    describe("When GET the project endpoint with a negative count", function () {
        var response;

        before(function (done) {
            client.get("/project?count=-11", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When GET the project endpoint with a zero count", function () {
        var response;

        before(function (done) {
            client.get("/project?count=0", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When GET the project endpoint with a non-numeric count", function () {
        var response;

        before(function (done) {
            client.get("/project?count=abc", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
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
