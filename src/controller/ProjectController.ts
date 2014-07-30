/// <reference path="../model/HttpResponse.ts" />
/// <reference path="../model/HttpRequest.ts" />
/// <reference path="../model/LoggedInUser.ts" />
/// <reference path="../service/AuthenticateUserAsTarget.ts" />
/// <reference path="../data/project/CRUD.ts" />
/// <reference path="../validate/ValidateProjectDto.ts" />

var q = require("q");

module controller {
    export class ProjectController {

        private configuration;
        private authenticateUser:service.AuthenticateUserAsTarget;
        private createProject:data.project.CreateProjectInDatabase;
        private getProject:data.project.GetProjectFromDatabase;
        private deleteProject:data.project.DeleteProjectFromDatabase;
        private updateProject:data.project.UpdateProjectInDatabase;

        constructor(configuration, authenticateUser:service.AuthenticateUserAsTarget, createProject:data.project.CreateProjectInDatabase, getProject:data.project.GetProjectFromDatabase, deleteProject:data.project.DeleteProjectFromDatabase, updateProject:data.project.UpdateProjectInDatabase) {
            this.configuration = configuration;
            this.authenticateUser = authenticateUser;
            this.createProject = createProject;
            this.getProject = getProject;
            this.deleteProject = deleteProject;
            this.updateProject = updateProject;
        }

        private createInternalServerError(log) {
            return function (err) {
                log.error(err);
                return new model.HttpResponse(500, { "code": "InternalServerError" });
            };
        }

        public post(request:model.HttpRequest, callback:(m:model.HttpResponse) => void) {

            var configuration = this.configuration;
            var getProject = this.getProject;
            var createProject = this.createProject;

            var projectCreateDto = request.body;
            if (request.parameters.target) {
                callback(new model.HttpResponse(405, {
                    "code": "MethodNotAllowed",
                    "message": "POST not supported on user"
                }));
            } else {
                this.authenticateUser.authenticate(false, request.authorization, null, (user:model.LoggedInUserDetails) => {
                    this.createProjectForUser(configuration, user, request, projectCreateDto, getProject, createProject, callback);
                }, (incorrect) => {
                    callback(new model.HttpResponse(401, { "code": "Unauthorized", "message": incorrect }));
                }, (reject) => {
                    callback(new model.HttpResponse(403, { "code": "Forbidden", "message": reject }));
                });
            }
        }

        createProjectForUser(configuration, user, request, projectCreateDto, getProject, createProject, callback) {
            var result = validate.ValidateCreateProjectDto(projectCreateDto);

            if (!result.success)
                callback(new model.HttpResponse(400, { "code": "BadRequest", "message": result.reason }));
            else {
                getProject
                    .run(projectCreateDto.name)
                    .then((project) => {
                        if (project)
                            return new model.HttpResponse(409, {
                                "code": "Conflict",
                                "message": "Project already exists"
                            });
                        return createProject
                            .run(user.userId, projectCreateDto.name, projectCreateDto.git)
                            .then(function () {
                                return new model.HttpResponse(201, {
                                    _href: configuration.host + "/project/" + projectCreateDto.name,
                                    git: projectCreateDto.git
                                });
                            }, this.createInternalServerError(request.log));
                    }, this.createInternalServerError(request.log)).then(callback);
            }
        }

        public put(request:model.HttpRequest, callback:(m:model.HttpResponse) => void) {

            var getProject = this.getProject;
            var updateProject = this.updateProject;
            var authenticateUser = this.authenticateUser;

            if (request.parameters.target) {
                var targetProject = request.parameters.target;

                authenticateUser.authenticate(false, request.authorization, null, (user) => {
                    var result = validate.ValidateUpdateProjectDto(request.body);
                    if (!result.success)
                        callback(new model.HttpResponse(400, { "code": "BadRequest", "message": result.reason }));
                    else {
                        getProject
                            .run(targetProject)
                            .then((project) => {
                                if (project) {
                                    if (!user.isSuper && project.userId != user.userId)
                                        return new model.HttpResponse(403, { "code": "Forbidden" });

                                    return updateProject
                                        .run(project.name, request.body.git)
                                        .then(function () {
                                            return new model.HttpResponse(200, { "git": request.body.git });
                                        }, this.createInternalServerError(request.log));
                                }
                                return new model.HttpResponse(404, {
                                    "code": "ResourceNotFound",
                                    "message": "Project not found"
                                });
                            }, this.createInternalServerError(request.log))
                            .then(callback);
                    }
                }, (error) => {
                    callback(new model.HttpResponse(401, { "code": "Unauthorized", "message": error }));
                }, (reject) => {
                    callback(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": reject }));
                });
            } else
                callback(new model.HttpResponse(405, {
                    "code": "MethodNotAllowed",
                    "message": "Missing Url Arguments"
                }));
        }

        public del(request:model.HttpRequest, callback:(m:model.HttpResponse) => void) {

            var getProject = this.getProject;
            var deleteProject = this.deleteProject;

            if (request.parameters.target) {
                this.authenticateUser.authenticate(false, request.authorization, null, (user) => {
                    getProject
                        .run(request.parameters.target)
                        .then((project) => {
                            if (!project)
                                return new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Project not found" });
                            if (!user.isSuper && project.userId != user.userId)
                                return new model.HttpResponse(403, { "code": "Forbidden" });

                            return deleteProject.run(project.name)
                                .then(function () {
                                    return new model.HttpResponse(204, { });
                                }, this.createInternalServerError(request.log)).then(callback);
                        }, this.createInternalServerError(request.log))
                        .then(callback);
                }, (error) => {
                    callback(new model.HttpResponse(401, { "code": "Unauthorized", "message": error }));
                }, (reject) => {
                    callback(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": reject }));
                });
            } else
                callback(new model.HttpResponse(405, {
                    "code": "MethodNotAllowed",
                    "message": "Missing Url Arguments"
                }));
        }

        public get(request:model.HttpRequest, callback:(m:model.HttpResponse) => void) {

            var getProject = this.getProject;
            if (request.parameters.target) {
                getProject
                    .run(request.parameters.target)
                    .then((project) => {
                        if (project)
                            return new model.HttpResponse(200, { "git": project.git });
                        return new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Project not found" });
                    }, this.createInternalServerError(request.log))
                    .then(callback);
            } else
                callback(new model.HttpResponse(405, { "code": "MethodNotAllowed",
                    "message": "Missing Url Arguments"
                }));
        }
    }
}
