/// <reference path='../service/AuthenticationService.ts' />
/// <reference path='../validate/ValidateProjectDto.ts' />
/// <reference path='../data/ProjectRepository.ts' />
/// <reference path='../model/Configuration.ts' />
/// <reference path='../model/LoggedInUser.ts' />
/// <reference path="../../typings/Q/Q.d.ts" />

var Q = require('q');

module controller {
    export class ProjectController {

        private projectRepository:data.ProjectRepository;

        constructor(projectRepository:data.ProjectRepository) {
            this.projectRepository = projectRepository;
        }

        public putAuthLevel = model.AuthenticationLevel.User;

        public put(request:model.HttpRequest) {
            var validateDto = validate.ValidateUpdateProjectDto(request.body);
            if (!validateDto.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validateDto.reason }));

            return this.projectRepository.getProject(request.parameters.target)
                .then((project:model.db.Project) => {
                    if (project) {
                        if (request.user.authLevel < model.AuthenticationLevel.Super && project.userId !== request.user.id)
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
        }

        public delAuthLevel = model.AuthenticationLevel.User;

        public del(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.projectRepository.getProject(request.parameters.target)
                .then((project:model.db.Project) => {
                    if (!project)
                        return new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Project not found" });
                    if (request.user.authLevel < model.AuthenticationLevel.Super && project.userId !== request.user.id)
                        return new model.HttpResponse(403, { "code": "Forbidden" });

                    return this.projectRepository.deleteProject(project.name)
                        .then(function () {
                            return new model.HttpResponse(204, { });
                        });
                });
        }

        public get(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.projectRepository.getProject(request.parameters.target)
                .then((project:model.db.Project) => {
                    if (project)
                        return new model.HttpResponse(200, { "git": project.git });
                    return new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Project not found" });
                });
        }
    }
}
