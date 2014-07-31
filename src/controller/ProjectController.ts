/// <reference path='../service/AuthenticationService.ts' />
/// <reference path='../validate/ValidateProjectDto.ts' />
/// <reference path='../data/ProjectRepository.ts' />
/// <reference path='../model/Configuration.ts' />
/// <reference path="../../typings/Q/Q.d.ts" />

var Q = require('q');

module controller {
    export class ProjectController {

        private authenticateUser: service.AuthenticationService;
        private projectRepository: data.ProjectRepository;

        constructor(authenticateUser: service.AuthenticationService,
                    projectRepository: data.ProjectRepository) {
            this.authenticateUser = authenticateUser;
            this.projectRepository = projectRepository;
        }

        public post(request:model.HttpRequest) : Q.IPromise<model.HttpResponse> {
            return Q(new model.HttpResponse(405, { "code": "MethodNotAllowed", "message": "POST not supported on user" }));
        }

        public put(request:model.HttpRequest) {
            return this.authenticateUser.atLeastUser(request.authorization, (login: model.LoggedInUserDetails) => {
                var validateDto = validate.ValidateUpdateProjectDto(request.body);
                if (!validateDto.success)
                    return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validateDto.reason }));

                return this.projectRepository.getProject(request.parameters.target)
                    .then((project) => {
                        if (project) {
                            if (!login.isSuper && project.userId !== login.userId)
                                return new model.HttpResponse(403, { "code": "Forbidden" });

                            return this.projectRepository.updateProject(project.name, request.body.git)
                                .then(() => {
                                    return new model.HttpResponse(200, {
                                        "git": request.body.git
                                    });
                                });
                        }
                        return new model.HttpResponse(404, {
                            "code": "ResourceNotFound",
                            "message": "Project not found"
                        });
                    });
            });
        }

        public del(request:model.HttpRequest) : Q.IPromise<model.HttpResponse> {
            return this.authenticateUser.atLeastUser(request.authorization, (login:model.LoggedInUserDetails) => {
                return this.projectRepository.getProject(request.parameters.target)
                    .then((project) => {
                        if (!project)
                            return new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Project not found" });
                        if (!login.isSuper && project.userId !== login.userId)
                            return new model.HttpResponse(403, { "code": "Forbidden" });

                        return this.projectRepository.deleteProject(project.name)
                            .then(function () {
                                return new model.HttpResponse(204, { });
                            });
                    });
            });
        }

        public get(request:model.HttpRequest) : Q.IPromise<model.HttpResponse> {
            return this.projectRepository.getProject(request.parameters.target)
                .then((project) => {
                    if (project)
                        return new model.HttpResponse(200, { "git": project.git });
                    return new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Project not found" });
                });
        }
    }
}
