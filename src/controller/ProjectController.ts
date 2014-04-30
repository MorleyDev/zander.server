/// <reference path="../model/HttpResponse.ts" />
/// <reference path="../model/HttpRequest.ts" />
/// <reference path="../model/LoggedInUser.ts" />
/// <reference path="../service/AuthenticateUserAsTarget.ts" />
/// <reference path="../data/project/CRUD.ts" />
/// <reference path="../validate/ValidateProjectDto.ts" />

module controller
{
    export class ProjectController {

        private configuration;
        private authenticateUser : service.AuthenticateUserAsTarget;
        private createProject : data.project.CreateProjectInDatabase;
        private getProject : data.project.GetProjectFromDatabase;
        private deleteProject : data.project.DeleteProjectFromDatabase;
        private updateProject : data.project.UpdateProjectInDatabase;

        constructor(configuration,
                    authenticateUser : service.AuthenticateUserAsTarget,
                    createProject : data.project.CreateProjectInDatabase,
                    getProject : data.project.GetProjectFromDatabase,
                    deleteProject : data.project.DeleteProjectFromDatabase,
                    updateProject : data.project.UpdateProjectInDatabase) {
            this.configuration = configuration;
            this.authenticateUser = authenticateUser;
            this.createProject = createProject;
            this.getProject = getProject;
            this.deleteProject = deleteProject;
            this.updateProject = updateProject;
        }

        public post(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {

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
                this.authenticateUser.authenticate(false, request.authorization, null, function(user : model.LoggedInUserDetails) {
                    validate.ValidateCreateProjectDto(projectCreateDto,
                        function(projectCreateDto) {
                            getProject.execute(projectCreateDto.name, function(project, err) {
                                if (err) {
                                    request.log.error(err);
                                    callback(new model.HttpResponse(500, { "code": "InternalServerError" }));
                                } else if (project) {
                                    callback(new model.HttpResponse(409, {
                                        "code" : "Conflict",
                                        "message" : "Project already exists"
                                    }));
                                } else {
                                    createProject.execute(user.userId, projectCreateDto.name, projectCreateDto.git, function(err) {
                                        if (err) {
                                            request.log.error(err);
                                            callback(new model.HttpResponse(500, { "code": "InternalServerError" }));
                                        } else {
                                            callback(new model.HttpResponse(201, {
                                                _href: configuration.host + "/project/" + projectCreateDto.name,
                                                git: projectCreateDto.git
                                            }));
                                        }
                                    });
                                }
                            });
                        },
                        function(failure) {
                            callback(new model.HttpResponse(400, { "code" : "BadRequest", "message" : failure }));
                    });
                }, function(error) {
                    callback(new model.HttpResponse(401, { "code" : "Unauthorized", "message" : error }));
                }, function (reject) {
                    callback(new model.HttpResponse(403, { "code" : "Forbidden", "message" : reject }));
                });
            }
        }

        public put(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {

            var getProject = this.getProject;
            var updateProject = this.updateProject;
            var authenticateUser = this.authenticateUser;

            if (request.parameters.target) {
                var targetProject = request.parameters.target;

                authenticateUser.authenticate(false,
                    request.authorization,
                    null,
                    function (user) {
                        validate.ValidateUpdateProjectDto(request.body, function (updateRequestDto) {
                            getProject.execute(targetProject, function (project, err) {
                                if (err) {
                                    request.log.error(err);
                                    callback(new model.HttpResponse(500, { "code": "InternalServerError" }))
                                } else if (project) {
                                    if (user.isSuper || project.userId == user.userId) {
                                        updateProject.execute(project.name, updateRequestDto.git, function (err) {
                                            if (err) {
                                                request.log.error(err);
                                                callback(new model.HttpResponse(500, { "code": "InternalServerError" }))
                                            } else {
                                                callback(new model.HttpResponse(200, {
                                                    "git": updateRequestDto.git
                                                }));
                                            }
                                        });
                                    } else {
                                        callback(new model.HttpResponse(403, { "code": "Forbidden" }));
                                    }
                                } else {
                                    callback(new model.HttpResponse(404, {
                                        "code": "ResourceNotFound",
                                        "message": "Project not found"
                                    }));
                                }
                            });

                        }, function (failure) {
                            callback(new model.HttpResponse(400, { "code": "BadRequest", "message": failure }));
                        });
                    }, function (error) {
                        callback(new model.HttpResponse(401, { "code": "Unauthorized", "message": error }));
                    }, function (reject) {
                        callback(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": reject }));
                    });
            } else
                callback(new model.HttpResponse(405, {
                    "code": "MethodNotAllowed",
                    "message": "Missing Url Arguments"
                }));
        }
        public del(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {

            var getProject = this.getProject;
            var deleteProject = this.deleteProject;

            if (request.parameters.target) {
                var targetProject = request.parameters.target;
                this.authenticateUser.authenticate(false, request.authorization, null,
                    function(user) {
                        getProject.execute(targetProject, function(project, err) {
                            if (err) {
                                request.log.error(err);
                                callback(new model.HttpResponse(500, { "code" : "InternalServerError" }))
                            } else if (project) {
                                if (user.isSuper || project.userId == user.userId) {
                                    deleteProject.execute(project.name, function (err) {
                                        if (err) {
                                            request.log.error(err);
                                            callback(new model.HttpResponse(500, { "code": "InternalServerError" }))
                                        } else {
                                            callback(new model.HttpResponse(204, { }));
                                        }
                                    });
                                } else {
                                    callback(new model.HttpResponse(403, { "code" : "Forbidden" }));
                                }
                            } else {
                                callback(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Project not found" }));
                            }
                        })
                    }, function(error) {
                        callback(new model.HttpResponse(401, { "code": "Unauthorized", "message": error }));
                    }, function (reject) {
                        callback(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": reject }));
                    });
            } else
                callback(new model.HttpResponse(405, {
                    "code":"MethodNotAllowed",
                    "message" : "Missing Url Arguments"
                }));
        }

        public get(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {

            var getProject = this.getProject;
            if (request.parameters.target) {
                var targetProject = request.parameters.target;
                getProject.execute(targetProject, function(project, err) {
                    if (err) {
                        request.log.error(err);
                        callback(new model.HttpResponse(500, { "code": "InternalServerError" }));
                    } else if (project) {
                        callback(new model.HttpResponse(200, { "git" : project.git }));
                    }else {
                        callback(new model.HttpResponse(404, {
                            "code" : "ResourceNotFound",
                            "message" : "Project not found"
                        }));
                    }
                });
            } else
                callback(new model.HttpResponse(405, { "code":"MethodNotAllowed",
                    "message" : "Missing Url Arguments"
                }));
        }
    }
}
