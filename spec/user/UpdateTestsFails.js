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
    describe("When PUT the user endpoint", function () {
        var response;

        before(function (done) {
            client.put("/user", { }, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 405 Method Not Allowed response is returned", function () {
            assert.equal(response.statusCode, 405);
        });
    });
    describe("When PUT a specific user endpoint", function () {
        var response;

        before(function (done) {
            client.put("/user/not_exist", { }, function (err, req, res, obj) {
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
        client = restify.createJsonClient({ url: "http://localhost:" + configuration.port });
        client.basicAuth(configuration.goduser.name, configuration.goduser.password);
        done();
    });
    describe("When PUT the root user endpoint", function () {
        var response;

        before(function (done) {
            client.put("/user", { }, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 405 Method Not Allowed response is returned", function () {
            assert.equal(response.statusCode, 405);
        });
    });
    describe("When PUT an existing user on the user endpoint and missing email", function () {
        var response;
        before(function (done) {
            client.post("/user",
                require("../models/UserDtos").CreateUserPostDto("some_user", "email@address.com", "saldiawiui"),
                function(err, req, res, obj) {
                    client.put("/user/some_user", { "password": "somepassword" }, function (err, req, res, obj) {
                        response = res;
                        done();
                    });
                }
            );
        });
        after(function (done) {
            client.del("/user/some_user", function(err, req, res) {
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When PUT a user on the user endpoint and missing password", function () {
        var response;
        before(function (done) {
            client.post("/user",
                require("../models/UserDtos").CreateUserPostDto("some_user", "email@address.com", "saldiawiui"),
                function (err, req, res, obj) {
                    client.put("/user/some_user", { "email": "email@someplace.co.uk" }, function (err, req, res, obj) {
                        response = res;
                        done();
                    });
                }
            );
        });
        after(function (done) {
            client.del("/user/some_user", function(err, req, res) {
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When PUT a non-existent user endpoint", function () {
        var actualResultPutUserDto;
        var response;
        before(function (done) {
            client.put("/user/" + "gobbledegook",
                require("../models/UserDtos").CreateUserPutDto("asdfaskuf@asfhas.com", "pogasha"),
                function (err, req, res, obj) {
                    response = res;
                    actualResultPutUserDto = obj;
                    done();
                });
        });
        it("Then a 404 Not Found response is returned", function () {
            assert.equal(response.statusCode, 404);
        });
    });
});
