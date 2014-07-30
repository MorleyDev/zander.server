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
        private authenticateUser: service.AuthenticateUserAsTarget;
        private createProject: data.project.CreateProjectInDatabase;
        private getProject: data.project.GetProjectFromDatabase;
        private deleteProject: data.project.DeleteProjectFromDatabase;
        private updateProject: data.project.UpdateProjectInDatabase;

        private internalAuthenticate(authorization, onSuccess) {
            return this.authenticateUser.run(false, authorization, null)
                .then((result:service.LogInResult) => {
                    switch (result.type) {
                        case service.LogInResultType.Success:
                            return onSuccess(result);

                        case service.LogInResultType.Rejection:
                            return new model.HttpResponse(403, { "code": "Forbidden", "message": result.reason });

                        case service.LogInResultType.Failure:
                            return new model.HttpResponse(401, { "code": "Unauthorized", "message": result.reason });

                        default:
                            return new model.HttpResponse(500, { "code": "InternalServerError" });

                    }
                });
        }

        constructor(configuration, authenticateUser:service.AuthenticateUserAsTarget, createProject:data.project.CreateProjectInDatabase, getProject:data.project.GetProjectFromDatabase, deleteProject:data.project.DeleteProjectFromDatabase, updateProject:data.project.UpdateProjectInDatabase) {
            this.configuration = configuration;
            this.authenticateUser = authenticateUser;
            this.createProject = createProject;
            this.getProject = getProject;
            this.deleteProject = deleteProject;
            this.updateProject = updateProject;
        }

        private static createInternalServerError(log) {
            return function (err) {
                log.error(err);
                return new model.HttpResponse(500, { "code": "InternalServerError" });
            };
        }

        public post(request:model.HttpRequest, callback:(m:model.HttpResponse) => void) {

            var configuration = this.configuration;
            var getProject = this.getProject;
            var createProject = this.createProject;

            q.fcall(() => {
                if (request.parameters.target)
                    return new model.HttpResponse(405, { "code": "MethodNotAllowed", "message": "POST not supported on user" });

                return this.internalAuthenticate(request.authorization, (result) => {
                    return ProjectController.createProjectForUser(configuration, result.user, request, getProject, createProject);
                });
            }).then(callback);
        }

        private static createProjectForUser(configuration, user, request, getProject, createProject) {
            var result = validate.ValidateCreateProjectDto(request.body);

            if (!result.success)
                return (new model.HttpResponse(400, { "code": "BadRequest", "message": result.reason }));
            else {
                return getProject
                    .run(request.body.name)
                    .then((project) => {
                        if (project)
                            return new model.HttpResponse(409, {
                                "code": "Conflict",
                                "message": "Project already exists"
                            });
                        return createProject
                            .run(user.userId, request.body.name, request.body.git)
                            .then(function () {
                                return new model.HttpResponse(201, {
                                    _href: configuration.host + "/project/" + request.body.name,
                                    git: request.body.git
                                });
                            }, this.createInternalServerError(request.log));
                    }, this.createInternalServerError(request.log));
            }
        }

        public put(request:model.HttpRequest, callback:(m:model.HttpResponse) => void) {

            if (request.parameters.target) {
                this.internalAuthenticate(request.authorization, (loginUser : service.LogInResult) => {
                    var targetProject = request.parameters.target;
                    return ProjectController.updateProjectForUser(request, targetProject, loginUser.user, this.getProject, this.updateProject);
                }).then(callback);
            } else
                callback(new model.HttpResponse(405, {
                    "code": "MethodNotAllowed",
                    "message": "Missing Url Arguments"
                }));
        }

        private static updateProjectForUser(request, targetProject, user, getProject, updateProject) {
            var validateDto = validate.ValidateUpdateProjectDto(request.body);
            if (!validateDto.success)
                return new model.HttpResponse(400, { "code": "BadRequest", "message": validateDto.reason });

            return getProject
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
                }, this.createInternalServerError(request.log));
        }

        public del(request:model.HttpRequest, callback:(m:model.HttpResponse) => void) {
            if (request.parameters.target) {

                this.internalAuthenticate(request.authorization, (result) => {
                    return ProjectController.deleteProjectForUser(request, result, this.getProject, this.deleteProject);
                }).then(callback);
            } else
                callback(new model.HttpResponse(405, {
                    "code": "MethodNotAllowed",
                    "message": "Missing Url Arguments"
                }));
        }

        private static deleteProjectForUser(request, login, getProject, deleteProject) {
            return getProject
                .run(request.parameters.target)
                .then((project) => {
                    if (!project)
                        return new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Project not found" });
                    if (!login.user.isSuper && project.userId != login.user.userId)
                        return new model.HttpResponse(403, { "code": "Forbidden" });

                    return deleteProject.run(project.name)
                        .then(function () {
                            return new model.HttpResponse(204, { });
                        }, this.createInternalServerError(request.log));
                }, this.createInternalServerError(request.log));
        }

        public get(request:model.HttpRequest, callback:(m:model.HttpResponse) => void) {
            q.fcall(() => {
                if (!request.parameters.target)
                    return new model.HttpResponse(405, { "code": "MethodNotAllowed",
                        "message": "Missing Url Arguments"
                    });

                return ProjectController.getRequestedProject(request, this.getProject);
            }).then(callback);
        }

        private static getRequestedProject(request, getProject) {
            return getProject
                .run(request.parameters.target)
                .then((project) => {
                    if (project)
                        return new model.HttpResponse(200, { "git": project.git });
                    return new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Project not found" });
                }, this.createInternalServerError(request.log));
        }
    }
}
