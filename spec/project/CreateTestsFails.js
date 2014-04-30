var assert = require("chai").assert;
var restify = require("restify");
var models = require("../models/ProjectDtos.js");

describe("Given a Rest Client and no credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var client;

    before(function (done) {
        client = restify.createJsonClient({  url: "http://localhost:" + configuration.port });
        done();
    });
    describe("When POST the project endpoint", function () {
        var response;

        before(function (done) {
            client.post("/project", { }, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 401 Not Authenticated response is returned", function () {
            assert.equal(response.statusCode, 401);
        });
    });
    describe("When POST a specific non-existent project endpoint", function () {
        var response;

        before(function (done) {
            client.post("/project/user_no_exist", { }, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 405 Method Not Allowed response is returned", function () {
            assert.equal(response.statusCode, 405);
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
    describe("When POST the project endpoint with a missing project name", function () {
        var response;

        before(function (done) {
            client.post("/project", { "git" : "http://git@somewhere/adfss" }, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the project endpoint with a missing git url", function () {
        var response;

        before(function (done) {
            client.post("/project", { "username" : "some_username" }, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the project endpoint with too short a name", function () {
        var response;

        before(function (done) {
            client.post("/project", models.ProjectCreatePostDto("u", "sfaksjhfhkj"), function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the project endpoint with too long a name", function () {
        var response;

        before(function (done) {
            client.post("/project", models.ProjectCreatePostDto("abcdghjkilkhgfyhjuika", "sfaksjhfhkj"), function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the project endpoint with a name containing invalid characters", function () {
        var response;

        before(function (done) {
            client.post("/project", models.ProjectCreatePostDto("a@hjkilkhgfyhjuika", "sfaksjhfhkj"), function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
});
