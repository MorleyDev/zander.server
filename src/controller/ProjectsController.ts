/// <reference path='../service/AuthenticationService.ts' />
/// <reference path='../validate/ValidateProjectDto.ts' />
/// <reference path='../data/ProjectRepository.ts' />
/// <reference path='../model/Configuration.ts' />
/// <reference path="../../typings/Q/Q.d.ts" />

module controller {
    export class ProjectsController {

        private configuration : model.Configuration;
        private authenticateUser: service.AuthenticationService;
        private projectRepository: data.ProjectRepository;

        constructor(configuration : model.Configuration,
                    authenticateUser: service.AuthenticationService,
                    projectRepository: data.ProjectRepository) {
            this.configuration = configuration;
            this.authenticateUser = authenticateUser;
            this.projectRepository = projectRepository;
        }

        public post(request:model.HttpRequest) : Q.IPromise<model.HttpResponse> {
            return this.authenticateUser.atLeastUser(request.authorization, (login : model.LoggedInUserDetails) => {
                var result = validate.ValidateCreateProjectDto(request.body);

                if (!result.success)
                    return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": result.reason }));
                else {
                    return this.projectRepository.getProject(request.body.name)
                        .then((project) => {
                            if (project)
                                return new model.HttpResponse(409, {
                                    "code": "Conflict",
                                    "message": "Project already exists"
                                });
                            return this.projectRepository.createProject(login.userId, request.body.name, request.body.git)
                                .then(() => {
                                    return new model.HttpResponse(201, {
                                        _href: this.configuration.host + "/project/" + request.body.name,
                                        git: request.body.git
                                    });
                                });
                        });
                }
            });
        }

        public put(request:model.HttpRequest) {
            return Q(new model.HttpResponse(405, {
                "code": "MethodNotAllowed",
                "message": "Missing Url Arguments"
            }));
        }

        public del(request:model.HttpRequest) : Q.IPromise<model.HttpResponse> {
            return Q(new model.HttpResponse(405, {
                "code": "MethodNotAllowed",
                "message": "Missing Url Arguments"
            }));
        }

        public get(request:model.HttpRequest) {
            return Q(new model.HttpResponse(405, { "code": "MethodNotAllowed",
                "message": "Missing Url Arguments"
            }));
        }
    }
}
