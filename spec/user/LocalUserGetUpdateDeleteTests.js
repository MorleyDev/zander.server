var assert = require("chai").assert;
var restify = require("restify");
var models = require("../models/UserDtos.js");
var errors = require("../models/ErrorDtos.js");

describe("Given a rest client and existing users", function () {

    var configuration = require(__dirname + "/../config.json");

    var username = "som-eus-er_name";
    var password = "somepassword";
    var email = "some@email.co.uk";

    var otherUsername = "some-other-username_";

    var client;
    before(function (done) {
        client = restify.createJsonClient({  url: "http://localhost:" + configuration.port });
        client.basicAuth(username, password);

        var godClient = restify.createJsonClient({  url: "http://localhost:" + configuration.port });
        godClient.basicAuth(configuration.goduser.name, configuration.goduser.password);
        godClient.post("/user", models.CreateUserPostDto(username, email, password), function(err, req, res, obj) {
            godClient.post("/user", models.CreateUserPostDto(otherUsername, "eaf@asd.com", "aisfjauhf"),
                function(err, req, res, obj) {
                    done();
                });
        });
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
            assert.equal(errorObj["code"], "Forbidden");
            assert.equal(errorObj["message"], "Do not possess required permission level");
        });
        it("Then a 403 Forbidden response is returned", function () {
            assert.equal(response.statusCode, 403);
        });
    });
    describe("When PUT to another user", function () {
        var response;
        before(function(done) {
            client.put("/user/" + otherUsername, models.CreateUserPutDto(newEmail, newPassword), function(err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then the expected response code of 404 Resource Not Found was returned", function () {
            assert.equal(response.statusCode, 404);
        });
    });

    describe("When GET another user", function () {
        var response;
        before(function(done) {
            client.get("/user/" + otherUsername, function(err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then the expected response code of 404 Resource Not Found was returned", function () {
            assert.equal(response.statusCode, 404);
        });
    });

    describe("When DELETE another user", function () {
        var response;
        before(function(done) {
            client.del("/user/" + otherUsername, function(err, req, res) {
                response = res;
                done();
            });
        });
        it("Then the expected response code of 404 Resource Not Found was returned", function () {
            assert.equal(response.statusCode, 404);
        });
    });

    var newEmail = "new@other_email.co.uk";
    var newPassword = "new@other_password.co.uk";
    describe("When PUT to update endpoint", function () {
        var response;
        var responseDto;
        before(function(done) {
            client.put("/user/" + username, models.CreateUserPutDto(newEmail, newPassword), function(err, req, res, obj) {
                response = res;
                responseDto = obj;
                done();
            });
        });
        it("Then the expected result was returned", function () {
            assert.deepEqual(responseDto, models.CreateUserGetResponseDto(newEmail));
        });
        it("Then the expected response code of 200 OK was returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });

    describe("When GET the update endpoint", function () {
        var response;
        var responseDto;
        before(function(done) {
            client.basicAuth(username, newPassword);
            client.get("/user/" + username, function(err, req, res, obj) {
                response = res;
                responseDto = obj;
                done();
            });
        });
        it("Then the expected result was returned", function () {
            assert.deepEqual(responseDto, models.CreateUserGetResponseDto(newEmail));
        });
        it("Then the expected response code of 200 OK was returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });

    describe("When DELETE the update endpoint", function () {
        var response;
        before(function(done) {
            client.del("/user/" + username, function(err, req, res) {
                response = res;
                done();
            });
        });
        it("Then the expected response code of 204 No Content was returned", function () {
            assert.equal(response.statusCode, 204);
        });
    });

    describe("When GET the deleted user", function () {
        var response;
        before(function(done) {
            client.get("/user/" + username, function(err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then the expected response code of 401 Unauthorized was returned", function () {
            assert.equal(response.statusCode, 401);
        });
    });
});



