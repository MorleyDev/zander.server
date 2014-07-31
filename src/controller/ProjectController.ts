/// <reference path="../model/HttpResponse.ts" />
/// <reference path="../model/HttpRequest.ts" />
/// <reference path="../model/LoggedInUser.ts" />
/// <reference path="../service/AuthenticateUserAsTarget.ts" />
/// <reference path="../service/MapAuthenticationToResult.ts" />
/// <reference path="../data/project/CRUD.ts" />
/// <reference path="../validate/ValidateProjectDto.ts" />

var Q = require("q");

module controller {
    export class ProjectController {

        private configuration;
        private authenticateUser: service.AuthenticateUserAndRespond;
        private createProject: data.project.CreateProjectInDatabase;
        private getProject: data.project.GetProjectFromDatabase;
        private deleteProject: data.project.DeleteProjectFromDatabase;
        private updateProject: data.project.UpdateProjectInDatabase;

        constructor(configuration, authenticateUser:service.AuthenticateUserAndRespond, createProject:data.project.CreateProjectInDatabase, getProject:data.project.GetProjectFromDatabase, deleteProject:data.project.DeleteProjectFromDatabase, updateProject:data.project.UpdateProjectInDatabase) {
            this.configuration = configuration;
            this.authenticateUser = authenticateUser;
            this.createProject = createProject;
            this.getProject = getProject;
            this.deleteProject = deleteProject;
            this.updateProject = updateProject;
        }

        public post(request:model.HttpRequest) : Q.IPromise<model.HttpResponse> {
            if (request.parameters.target)
                return Q(new model.HttpResponse(405, { "code": "MethodNotAllowed", "message": "POST not supported on user" }));

            return this.authenticateUser.atLeastUser(request.authorization, (result) => {
                return ProjectController.createProjectForUser(this.configuration, result.user, request, this.getProject, this.createProject);
            });
        }

        private static createProjectForUser(configuration, user, request, getProject, createProject) : Q.IPromise<model.HttpResponse> {
            var result = validate.ValidateCreateProjectDto(request.body);

            if (!result.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": result.reason }));
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
                            });
                    });
            }
        }

        public put(request:model.HttpRequest) {

            if (!request.parameters.target)
                return Q(new model.HttpResponse(405, {
                    "code": "MethodNotAllowed",
                    "message": "Missing Url Arguments"
                }));

            return this.authenticateUser.atLeastUser(request.authorization, (loginUser:service.LogInResult) => {
                return ProjectController.updateProjectForUser(request, request.parameters.target, loginUser.user, this.getProject, this.updateProject);
            });
        }

        private static updateProjectForUser(request, targetProject, user, getProject, updateProject) : Q.IPromise<model.HttpResponse> {
            var validateDto = validate.ValidateUpdateProjectDto(request.body);
            if (!validateDto.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validateDto.reason }));

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
                            });
                    }
                    return new model.HttpResponse(404, {
                        "code": "ResourceNotFound",
                        "message": "Project not found"
                    });
                });
        }

        public del(request:model.HttpRequest) : Q.IPromise<model.HttpResponse> {
            if (request.parameters.target)
                return this.authenticateUser.atLeastUser(request.authorization, (result) => {
                    return ProjectController.deleteProjectForUser(request, result, this.getProject, this.deleteProject);
                });

            return Q(new model.HttpResponse(405, {
                "code": "MethodNotAllowed",
                "message": "Missing Url Arguments"
            }));
        }

        private static deleteProjectForUser(request, login, getProject, deleteProject) : Q.IPromise<model.HttpResponse> {
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
                        });
                });
        }

        public get(request:model.HttpRequest) {
            if (!request.parameters.target)
                return Q(new model.HttpResponse(405, { "code": "MethodNotAllowed",
                    "message": "Missing Url Arguments"
                }));

            return ProjectController.getRequestedProject(request, this.getProject);
        }

        private static getRequestedProject(request, getProject) : Q.IPromise<model.HttpResponse> {
            return getProject
                .run(request.parameters.target)
                .then((project) => {
                    if (project)
                        return new model.HttpResponse(200, { "git": project.git });
                    return new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Project not found" });
                });
        }
    }
}
