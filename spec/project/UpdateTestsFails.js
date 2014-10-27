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
    describe("When PUT the project endpoint", function () {
        var response;

        before(function (done) {
            client.put("/project", { }, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 405 Method Not Allowed response is returned", function () {
            assert.equal(response.statusCode, 405);
        });
    });
    describe("When PUT a specific non-existent project endpoint", function () {
        var response;

        before(function (done) {
            client.put("/project/user_no_exist", { }, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 401 Not Authenticated response is returned", function () {
            assert.equal(response.statusCode, 401);
        });
    });
});

describe("Given a Rest Client and credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var project = models.ValidProjectName();

    var client;
    before(function (done) {
        client = restify.createJsonClient({  url: "http://localhost:" + configuration.port });
        client.basicAuth(configuration.goduser.name, configuration.goduser.password);

        client.post("/project", models.ProjectCreatePostDto(project, models.GitVcs("http://some.git/url")), function (err, req, res, obj) {
            done();
        });
    });
    describe("When PUT the project endpoint without a src", function () {
        var response;

        before(function (done) {
            client.put("/project/" + encodeURI(project), { }, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When PUT the project endpoint with an empty git url", function () {
        var response;

        before(function (done) {
            client.put("/project/" + encodeURI(project), models.ProjectUpdatePutDto(models.GitVcs("")), function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When PUT the project endpoint with an invalid vcs", function () {
        var response;

        before(function (done) {
            client.put("/project/" + encodeURI(project), models.ProjectUpdatePutDto(models.InvalidVcs()), function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
});
