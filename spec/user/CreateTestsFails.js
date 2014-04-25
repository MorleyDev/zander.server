var assert = require("chai").assert;
var restify = require("restify");
var models = require("../models/UserDtos.js");

describe("Given a Rest Client and no credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var client;

    before(function (done) {
        client = restify.createJsonClient({  url: "http://" + configuration.host + ":" + configuration.port });
        done();
    });
    describe("When POST the user endpoint", function () {
        var response;

        before(function (done) {
            var createUserDto = new models.CreateUserPostDto("some_username", "email@host.com", "some_password");

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 401 Authentication Failed response is returned", function () {
            assert.equal(response.statusCode, 401);
        });
    });
});

describe("Given a Rest Client and incorrect credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var client;
    before(function (done) {
        client = restify.createJsonClient({  url: "http://" + configuration.host + ":" + configuration.port });
        client.basicAuth(configuration.goduser.name, "wrong_password");
        done();
    });
    describe("When POST the user endpoint", function () {
        var response;

        before(function (done) {
            var createUserDto = new models.CreateUserPostDto("some_username", "email@host.com", "some_password");

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 401 Authentication Failed response is returned", function () {
            assert.equal(response.statusCode, 401);
        });
    });
});

describe("Given a Rest Client and correct credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var client;
    beforeEach(function (done) {
        client = restify.createJsonClient({  url: "http://" + configuration.host + ":" + configuration.port });
        client.basicAuth(configuration.goduser.name, configuration.goduser.password);
        done();
    });
    describe("When POST the user endpoint with an empty request", function () {
        var response;

        beforeEach(function (done) {
            client.post("/user", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with a username containing invalid characters", function () {
        var response;

        beforeEach(function (done) {
            var createUserDto = new models.CreateUserPostDto("@invalid", "email@host.com", "some_password");

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with too short a username", function () {
        var response;

        beforeEach(function (done) {
            var createUserDto = new models.CreateUserPostDto("s", "email@host.com", "some_password");

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with too short a password", function () {
        var response;

        beforeEach(function (done) {
            var createUserDto = new models.CreateUserPostDto("valid_username", "email@host.com", "pw");

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with too short a password", function () {
        var response;

        beforeEach(function (done) {
            var createUserDto = new models.CreateUserPostDto("valid_username", "email@host.com", "pw");

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with too long a username", function () {
        var response;

        beforeEach(function (done) {
            var createUserDto = new models.CreateUserPostDto("VYhH7NV2QChZcyx35vA28", "email@host.com", "pw3raawfasf");

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with missing username", function () {
        var response;

        beforeEach(function (done) {
            var createUserDto = {
                "email" : "email@someplace.co.uk",
                "password" : "foieiufghaijfhsjakdfhka"
            };

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with missing password", function () {
        var response;

        beforeEach(function (done) {
            var createUserDto = {
                "username" : "some_user",
                "email" : "email@someplace.co.uk"
            };

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with missing email", function () {
        var response;

        beforeEach(function (done) {
            var createUserDto = {
                "username" : "some_user",
                "password" : "foieiufghaijfhsjakdfhka"
            };

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
});
