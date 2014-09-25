var assert = require("chai").assert;
var restify = require("restify");
var models = require("../models/ProjectDtos.js");
var userModels = require("../models/UserDtos.js");
var errors = require("../models/ErrorDtos.js");

describe("Given a rest client and user", function () {

    var configuration = require(__dirname + "/../config.json");

    var client;
    var noCredentialClient;
    var otherUserClient;
    var godClient;
    var username = "asdfasfusername";
    before(function(done) {
        noCredentialClient = restify.createJSONClient({ url: "http://localhost:" + configuration.port });
        godClient = restify.createJSONClient({ url: "http://localhost:" + configuration.port });
        godClient.basicAuth(configuration.goduser.name, configuration.goduser.password);

        var otherUsername = "adksjlkauser";

        var password = "awsdpassword";
        godClient.post("/user", userModels.CreateUserPostDto(username, "mail@email.com", password), function(err, req, res, obj) {
            client = restify.createJsonClient({ url: "http://localhost:" + configuration.port });
            client.basicAuth(username, password);

            godClient.post("/user", userModels.CreateUserPostDto(otherUsername, "mail2@email2.com", password), function(err, req, res, obj) {
                otherUserClient = restify.createJSONClient({ url: "http://localhost:" + configuration.port });
                otherUserClient.basicAuth(otherUsername, password);
                done();
            });
        });
    });

    var projectName = models.ValidProjectName();
    var projectGit = "git://some@project-git/addr";

    describe("When getting a non-existent project", function () {

        var response;
        var objectResponse;
        before(function(done) {
            client.get("/project/" + projectName, function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected response of 404 Not Found is returned", function () {
            assert.equal(response.statusCode, 404);
        });
    });
    
    describe("When getting the project collection and no projects", function () {
        
        var response;
        var objectResponse;
        before(function(done) {
            client.get("/project", function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected message body is returned", function () {
            assert.deepEqual(objectResponse, models.ProjectGetCollectionResponseDto(0, [ ]));
        });
        it("Then the expected response of 200 OK is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });

    describe("When creating a project named " + projectName, function () {

        var response;
        var objectResponse;
        before(function(done) {
            client.post("/project", models.ProjectCreatePostDto(projectName, projectGit), function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected response body was returned", function () {
            assert.deepEqual(objectResponse, models.ProjectCreateResponseDto(configuration.host + "/project/" + projectName, projectGit));
        });
        it("Then the expected response of 201 Created is returned", function () {
            assert.equal(response.statusCode, 201);
        });
    });

    describe("When creating a project that already exists called" + projectName, function () {

        var response;
        before(function(done) {
            client.post("/project", models.ProjectCreatePostDto(projectName, projectGit), function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then the expected response of 409 Conflict is returned", function () {
            assert.equal(response.statusCode, 409);
        });
    });

    describe("When updating the created project " + projectName + " as another user", function () {

        var response;
        var objectResponse;
        before(function(done) {
            otherUserClient.put("/project/" + projectName, models.ProjectUpdatePutDto("http://ignore/me"), function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected response of 403 Forbidden is returned", function () {
            assert.equal(response.statusCode, 403);
        });
    });

    describe("When getting the created project " + projectName + " without any credentials", function () {

        var response;
        var objectResponse;
        before(function(done) {
            noCredentialClient.get("/project/" + projectName, function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected response body was returned", function () {
            assert.deepEqual(objectResponse, models.ProjectGetResponseDto(projectGit));
        });
        it("Then the expected response of 200 OK is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });

    var newGitUrl = "http://some_other_git/syr.sad/asf.git";
    describe("When updating the created project" + projectName, function () {

        var response;
        var objectResponse;
        before(function(done) {
            client.put("/project/" + projectName, models.ProjectUpdatePutDto(newGitUrl), function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected response body was returned", function () {
            assert.deepEqual(objectResponse, models.ProjectUpdatePutResponseDto(newGitUrl));
        });
        it("Then the expected response of 200 OK is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });

    describe("When getting the updated project " + projectName + " without any credentials", function () {

        var response;
        var objectResponse;
        before(function(done) {
            noCredentialClient.get("/project/" + projectName, function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected response body was returned", function () {
            assert.deepEqual(objectResponse, models.ProjectGetResponseDto(newGitUrl));
        });
        it("Then the expected response of 200 OK is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });

    describe("When getting the existing projects without any credentials", function () {

        var response;
        var objectResponse;
        before(function(done) {
            noCredentialClient.get("/project", function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected response body was returned", function () {
            assert.deepEqual(objectResponse, models.ProjectGetCollectionResponseDto(1, [{ 
                "name": projectName, 
                "_href": configuration.host + "/project/" + projectName
            }]));
        });
        it("Then the expected response of 200 OK is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });

    describe("When deleting the project " + projectName + " as another user", function () {

        var response;
        before(function(done) {
            otherUserClient.del("/project/" + projectName, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then the expected response of 403 Forbidden is returned", function () {
            assert.equal(response.statusCode, 403);
        });
    });

    describe("When deleting the project" + projectName, function () {

        var response;
        before(function(done) {
            client.del("/project/" + projectName, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then the expected response of 204 No Content is returned", function () {
            assert.equal(response.statusCode, 204);
        });
    });

    describe("When getting the deleted project " + projectName + " without any credentials", function () {

        var response;
        before(function(done) {
            noCredentialClient.get("/project/" + projectName, function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then the expected response of 404 Not Found is returned", function () {
            assert.equal(response.statusCode, 404);
        });
    });

    describe("When the user who created a project is deleted and the project is retrieved", function () {
        var response;
        before(function (done) {
            client.post("/project", models.ProjectCreatePostDto(projectName, projectGit), function (err, req, res, obj) {
                client.del("/user/" + username, function (err, req, res) {
                    noCredentialClient.get("/project/" + projectName, function (err, req, res, obj) {
                        response = res;
                        done();
                    });
                })
            });
        });
        it("Then the expected response of 404 Not Found is returned", function () {
            assert.equal(response.statusCode, 404)
        })
    })
});
