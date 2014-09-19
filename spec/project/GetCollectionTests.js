var assert = require("chai").assert;
var restify = require("restify");
var models = require("../models/ProjectDtos.js");
var userModels = require("../models/UserDtos.js");

describe("Given a Rest Client and credentials with created projects", function () {
    "use strict";

    var configuration = require(__dirname + "/../config.json");
    var createdProjects = [];

    var client;
    var godClient;
    before(function(done) {
        godClient = restify.createJSONClient({ url: "http://localhost:" + configuration.port });
        godClient.basicAuth(configuration.goduser.name, configuration.goduser.password);

        client = restify.createJSONClient({ url: "http://localhost:" + configuration.port });
        
        for(var i = 0; i < 105; ++i) {
            var projectName = "project" + i;
            createdProjects.push(projectName);
        }
        createdProjects.reverse();
        
        function createProject(index) {
            if (index == createdProjects.length) {
                createdProjects.reverse();
                createdProjects = createdProjects.sort().map(function (name) {
                    return {
                        "name": name,
                        "_href": configuration.host + "/project/" + name
                    };
                });
                done();
                return;
            }
            
            godClient.post("/project", 
                models.ProjectCreatePostDto(createdProjects[index], "http://github.com/some/project.git"), 
                function () {
                    createProject(index+1);
                });
        }
        createProject(0);
    });
    after(function (done) {
        function deleteProject(index) {
            if (index == 105) {
                done();
                return;
            }
                
            godClient.del("/project/" + createdProjects[index], function () {
                deleteProject(index+1);
            });
        }
        deleteProject(0);
    });

    describe("When GET the project endpoint with a name.contains filter", function () {
        var response;
        var objectResponse;

        before(function (done) {
            client.get("/project?name.contains=ject10", function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected dto is returned", function () {
            var expectedProjects = createdProjects.filter(function (project) {
                return project.name.indexOf("ject10") >= 0;
            });
            
            assert.deepEqual(objectResponse, models.ProjectGetCollectionResponseDto(expectedProjects.length, expectedProjects));
        });
        it("Then a 200 OK response is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });
    
    describe("When GET the project endpoint", function () {
        var response;
        var objectResponse;

        before(function (done) {
            client.get("/project", function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected dto is returned", function () {
            assert.deepEqual(objectResponse, models.ProjectGetCollectionResponseDto(105, createdProjects.slice(0,100)));
        });
        it("Then a 200 OK response is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });
    
    describe("When GET the project endpoint with a count", function () {
        var response;
        var objectResponse;

        before(function (done) {
            client.get("/project?count=20", function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected dto is returned", function () {
            assert.deepEqual(objectResponse, models.ProjectGetCollectionResponseDto(105, createdProjects.slice(0,20)));
        });
        it("Then a 200 OK response is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });
    
    describe("When GET the project endpoint with a start index", function () {
        var response;
        var objectResponse;

        before(function (done) {
            client.get("/project?start=20", function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected dto is returned", function () {
            assert.deepEqual(objectResponse, models.ProjectGetCollectionResponseDto(105, createdProjects.slice(20,120)));
        });
        it("Then a 200 OK response is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });
    
    describe("When GET the project endpoint with a start index and count", function () {
        var response;
        var objectResponse;

        before(function (done) {
            client.get("/project?start=20&count=40", function (err, req, res, obj) {
                response = res;
                objectResponse = obj;
                done();
            });
        });
        it("Then the expected dto is returned", function () {
            assert.deepEqual(objectResponse, models.ProjectGetCollectionResponseDto(105, createdProjects.slice(20,60)));
        });
        it("Then a 200 OK response is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });
    
    describe("When GET the project endpoint with a start index of 4294967295", function () {
        var response;

        before(function (done) {
            client.get("/project?start=4294967295", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });
    describe("When GET the project endpoint with a count of 1000", function () {
        var response;

        before(function (done) {
            client.get("/project?count=1000", function (err, req, res, obj) {
                response = res;
                done();
            });
        });
        it("Then a 400 Bad Request response is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });
});
