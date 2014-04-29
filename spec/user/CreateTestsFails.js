var assert = require("chai").assert;
var restify = require("restify");
var models = require("../models/UserDtos.js");
var errors = require("../models/ErrorDtos.js");

describe("Given a Rest Client and no credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var client;
    before(function (done) {
        client = restify.createJsonClient({  url: "http://localhost:" + configuration.port });
        done();
    });
    describe("When POST the user endpoint", function () {
        var response;
        var errorObj;

        before(function (done) {
            var createUserDto = models.CreateUserPostDto("some_username", "email@host.com", "some_password");

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                errorObj = obj;
                done();
            });
        });
        it("Then the expected error code was returned", function() {
            assert.equal(errorObj["code"], "Unauthorized");
            assert.equal(errorObj["message"], "No or Incorrect Authentication details provided");
        });
        it("Then a 401 Authentication Failed response is returned", function () {
            assert.equal(response.statusCode, 401);
        });
    });
    describe("When POST a non-existent user endpoint", function () {
        var response;
        var errorObj;

        before(function (done) {
            var createUserDto = models.CreateUserPostDto("some_username", "email@host.com", "some_password");

            client.post("/user/no-exists", createUserDto, function (err, req, res, obj) {
                response = res;
                errorObj = obj;
                done();
            });
        });
        it("Then the expected error code was returned", function() {
            assert.equal(errorObj["code"], "MethodNotAllowed");
            assert.equal(errorObj["message"], "POST not supported on user");
        });
        it("Then a 405 Method Not Allowed response is returned", function () {
            assert.equal(response.statusCode, 405);
        });
    });
});

describe("Given a Rest Client and incorrect credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var client;
    beforeEach(function (done) {
        client = restify.createJsonClient({  url: "http://localhost:" + configuration.port });
        client.basicAuth(configuration.goduser.name, "wrong_password");
        done();
    });
    describe("When POST the user endpoint", function () {
        var response;
        var errorObj;

        beforeEach(function (done) {
            var createUserDto = models.CreateUserPostDto("some_username", "email@host.com", "some_password");

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                errorObj = obj;
                done();
            });
        });
        it("Then the expected error code was returned", function() {
            assert.equal(errorObj["code"], "Unauthorized");
            assert.equal(errorObj["message"], "No or Incorrect Authentication details provided");
        });
        it("Then a 401 Authentication Failed response is returned", function () {
            assert.equal(response.statusCode, 401);
        });
    });
});

describe("Given a Rest Client and god credentials", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");

    var client;
    before(function (done) {
        client = restify.createJsonClient({  url: "http://localhost:" + configuration.port });
        client.basicAuth(configuration.goduser.name, configuration.goduser.password);
        done();
    });
    describe("When POST the user endpoint with an empty request", function () {
        var response;
        var errorObj;

        beforeEach(function (done) {
            client.post("/user", function (err, req, res, obj) {
                response = res;
                errorObj = obj;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with a username containing invalid characters", function () {
        var response;
        var errorObj;

        beforeEach(function (done) {
            var createUserDto = models.CreateUserPostDto("@invalid", "email@host.com", "some_password");

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                errorObj = obj;
                done();
            });
        });
        it("Then the expected error code was returned", function() {
            assert.equal(errorObj["code"], "BadRequest");
            assert.equal(errorObj["message"], "Username Must Only Contain Alphanumeric Characters or Underscore");
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with too short a username", function () {
        var response;
        var errorObj;

        beforeEach(function (done) {
            var createUserDto = models.CreateUserPostDto("s", "email@host.com", "some_password");

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                errorObj = obj;
                done();
            });
        });
        it("Then the expected error code was returned", function() {
            assert.equal(errorObj["code"], "BadRequest");
            assert.equal(errorObj["message"], "Username Not Between 3-20 Characters");
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with too short a password", function () {
        var response;
        var errorObj;

        beforeEach(function (done) {
            var createUserDto = models.CreateUserPostDto("valid_username", "email@host.com", "pw");

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                errorObj = obj;
                done();
            });
        });
        it("Then the expected error code was returned", function() {
            assert.equal(errorObj["code"], "BadRequest");
            assert.equal(errorObj["message"], "Passwords must be 3 or more characters");
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with too long a username", function () {
        var response;
        var errorObj;

        beforeEach(function (done) {
            var createUserDto = models.CreateUserPostDto("VYhH7NV2QChZcyx35vA28", "email@host.com", "pw3raawfasf");

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                errorObj = obj;
                done();
            });
        });
        it("Then the expected error code was returned", function() {
            assert.equal(errorObj["code"], "BadRequest");
            assert.equal(errorObj["message"], "Username Not Between 3-20 Characters");
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with missing username", function () {
        var response;
        var errorObj;

        beforeEach(function (done) {
            var createUserDto = {
                "email" : "email@someplace.co.uk",
                "password" : "foieiufghaijfhsjakdfhka"
            };

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                errorObj = obj;
                done();
            });
        });
        it("Then the expected error code was returned", function() {
            assert.equal(errorObj["code"], "BadRequest");
            assert.equal(errorObj["message"], "Username Not Provided");
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with missing password", function () {
        var response;
        var errorObj;

        beforeEach(function (done) {
            var createUserDto = {
                "username" : "some_user",
                "email" : "email@someplace.co.uk"
            };

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                errorObj = obj;
                done();
            });
        });
        it("Then the expected error code was returned", function() {
            assert.equal(errorObj["code"], "BadRequest");
            assert.equal(errorObj["message"], "Password Not Provided");
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint with missing email", function () {
        var response;
        var errorObj;

        beforeEach(function (done) {
            var createUserDto = {
                "username" : "some_user",
                "password" : "foieiufghaijfhsjakdfhka"
            };

            client.post("/user", createUserDto, function (err, req, res, obj) {
                response = res;
                errorObj = obj;
                done();
            });
        });
        it("Then the expected error code was returned", function() {
            assert.equal(errorObj["code"], "BadRequest");
            assert.equal(errorObj["message"], "E-Mail Not Provided");
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 400);
        });
    });
    describe("When POST the user endpoint", function () {

        beforeEach(function (done) {
            var createUserDto = {
                "username" : "some_user",
                "email" : "some@email.com",
                "password" : "foieiufghaijfhsjakdfhka"
            };
            client.post("/user", createUserDto, function (err, req, res, obj) {
                done();
            });
        });
        afterEach(function (done) {
            client.del("/user/some_user", function (err) {
                done();
            });
        });
        describe("for an existing user", function () {
            var response;
            var errorObj;

            beforeEach(function (done) {
                var createUserDto = {
                    "username": "some_user",
                    "email": "some_ither@email.com",
                    "password": "foieiufasgahghaijfhsjakdfhka"
                };
                client.post("/user", createUserDto, function (err, req, res, obj) {
                    response = res;
                    errorObj = obj;
                    done();
                });
            });
            it("Then the expected error code was returned", function () {
                assert.equal(errorObj["code"], "Conflict");
                assert.equal(errorObj["message"], "User already exists");
            });
            it("Then a 409 Conflict response is returned", function () {
                assert.equal(response.statusCode, 409);
            });
        });
    });
});
