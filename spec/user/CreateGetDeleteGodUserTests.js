var assert = require("chai").assert;
var restify = require("restify");
var models = require("../models/UserDtos.js");
var errors = require("../models/ErrorDtos.js");

describe("Given a Rest Client and god credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var client;
    before(function (done) {
        client = restify.createJsonClient({  url: "http://localhost:" + configuration.port });
        client.basicAuth(configuration.goduser.name, configuration.goduser.password);
        done();
    });

    var expectedUsername = "some_username";
    var expectedEmail = "email@host.com";
    var expectedPassword = "some_password";
    var expectedHref = configuration.host + "/user/" + expectedUsername;
    var expectedResultPostUserDto = models.CreateUserPostResponseDto(expectedUsername, expectedEmail, expectedHref);

    describe("When POST the user endpoint", function () {
        var actualResultUserDto;

        var response;
        before(function (done) {
            var createUserDto = models.CreateUserPostDto(expectedUsername, expectedEmail, expectedPassword);

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                actualResultUserDto = obj;
                done();
            });
        });
        it("Then the expected result dto was returned", function () {
            assert.deepEqual(actualResultUserDto, expectedResultPostUserDto);
        });
        it("Then a 201 Created response is returned", function () {
            assert.equal(response.statusCode, 201);
        });
    });

    describe("When GET the created user", function () {
        var actualResultUserDto = null;
        var expectedResultGetUserDto = models.CreateUserGetResponseDto(expectedEmail);

        var response;
        before(function (done) {
            client.get("/user/" + expectedUsername, function (err, req, res, obj) {
                response = res;
                actualResultUserDto = obj;
                done();
            });
        });
        it("Then the expected result dto was returned", function () {
            assert.deepEqual(actualResultUserDto, expectedResultGetUserDto);
        });
        it("Then a 200 OK is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });

    describe("When DELETE the created user", function () {
        var response;
        before(function (done) {
            client.del("/user/" + expectedUsername, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 204 OK is returned", function () {
            assert.equal(response.statusCode, 204);
        });
    });

    describe("When GET the deleted user", function () {
        var response;
        var errorObj;
        before(function (done) {
            client.get("/user/" + expectedUsername, function (err, req, res, obj) {
                response = res;
                errorObj = obj;
                done();
            });
        });
        it("Then the expected error code was returned", function() {
            assert.deepEqual(errorObj, errors.CreateErrorDto("ResourceNotFound", "User not found"));
        });
        it("Then a 404 Not Found is returned", function () {
            assert.equal(response.statusCode, 404);
        });
    });
});
