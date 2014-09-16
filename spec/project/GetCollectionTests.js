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
            assert.deepEqual(objectResponse, models.ProjectGetCollectionResponseDto(105, createdProjects.sort().slice(0,100)));
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
            assert.deepEqual(objectResponse, models.ProjectGetCollectionResponseDto(105, createdProjects.sort().slice(0,20)));
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
            assert.deepEqual(objectResponse, models.ProjectGetCollectionResponseDto(105, createdProjects.sort().slice(20,120)));
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
            assert.deepEqual(objectResponse, models.ProjectGetCollectionResponseDto(105, createdProjects.sort().slice(20,60)));
        });
        it("Then a 200 OK response is returned", function () {
            assert.equal(response.statusCode, 200);
        });
    });
});
