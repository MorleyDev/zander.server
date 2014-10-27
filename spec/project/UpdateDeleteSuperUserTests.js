var assert = require("chai").assert;
var restify = require("restify");
var models = require("../models/ProjectDtos.js");
var userModels = require("../models/UserDtos.js");
var errors = require("../models/ErrorDtos.js");

describe("Given a rest client and super user", function () {

    var configuration = require(__dirname + "/../config.json");

    var godClient;
    var noCredentialClient;
    var projectName = models.ValidProjectName();
    var projectGit = "git://some@project-git/addr";

    before(function(done) {
        noCredentialClient = restify.createJSONClient({ url: "http://localhost:" + configuration.port });
       godClient = restify.createJSONClient({ url: "http://localhost:" + configuration.port });
        godClient.basicAuth(configuration.goduser.name, configuration.goduser.password);

        var otherUsername = "adksjlkauser";
        var password = "awsdpassword";
        godClient.post("/user", userModels.CreateUserPostDto(otherUsername, "mail2@email2.com", password), function(err, req, res, obj) {
            var otherUserClient = restify.createJSONClient({ url: "http://localhost:" + configuration.port });
            otherUserClient.basicAuth(otherUsername, password);

            otherUserClient.post("/project", models.ProjectCreatePostDto(projectName, models.GitVcs(projectGit)), function (err, req, res, obj) {
                done();
            });
        });
    });

    describe("When updating the project of another user", function () {

        var response;
        before(function(done) {
            godClient.put("/project/" + encodeURI(projectName), models.ProjectUpdatePutDto(models.GitVcs("http://some_other_git/syr.sad/asf.git")), function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then the expected response of 200 OK is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });

    describe("When deleting the project of another user", function () {

        var response;
        before(function(done) {
            godClient.del("/project/" + encodeURI(projectName), function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then the expected response of 204 No Content is returned", function () {
            assert.equal(response.statusCode, 204);
        });
    });

    describe("When getting the deleted project without any credentials", function () {

        var response;
        before(function(done) {
            noCredentialClient.get("/project/" + encodeURI(projectName), function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then the expected response of 404 Not Found is returned", function () {
            assert.equal(response.statusCode, 404);
        });
    });

});
