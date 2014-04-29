var assert = require("chai").assert;
var restify = require("restify");
var models = require("../models/UserDtos.js");

describe("Given a Rest Client and god credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var client;
    before(function (done) {
        client = restify.createJsonClient({  url: "http://localhost:" + configuration.port });
        client.basicAuth(configuration.goduser.name, configuration.goduser.password);
        done();
    });

    var originalUsername = "some_username";
    var originalEmail = "email@host.com";
    var originalPassword = "some_password";

    var newEmail = "new@email.com";
    var newPassword = "some_new_password";
    var expectedPutDto = models.CreateUserGetResponseDto(newEmail);

    describe("When PUT a created user endpoint", function () {
        var actualResultPutUserDto;
        var response;
        before(function (done) {
            client.post("/user",
                        models.CreateUserPostDto(originalUsername, originalEmail, originalPassword),
                        function (err, req, res, obj) {
                client.put("/user/" + originalUsername,
                    models.CreateUserPutDto(newEmail, newPassword),
                    function (err, req, res, obj) {
                        response = res;
                        actualResultPutUserDto = obj;
                        done();
                    });
            });
        });
        it("Then the expected response dto was returned", function () {
            assert.deepEqual(actualResultPutUserDto, expectedPutDto);
        });
        it("Then a 200 OK response is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });

    describe("When GET the updated user", function () {
        var actualResultUserDto = null;

        var response;
        before(function (done) {
            client.get("/user/" + originalUsername, function (err, req, res, obj) {
                response = res;
                actualResultUserDto = obj;
                done();
            });
        });
        it("Then the expected result dto was returned", function () {
            assert.deepEqual(expectedPutDto, actualResultUserDto);
        });
        it("Then a 200 OK is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });
});
