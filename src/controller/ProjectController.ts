/// <reference path='../service/AuthenticationService.ts' />
/// <reference path='../validate/ValidateProjectDto.ts' />
/// <reference path='../data/ProjectRepository.ts' />
/// <reference path='../model/Configuration.ts' />
/// <reference path='../model/LoggedInUser.ts' />
/// <reference path="../../typings/Q/Q.d.ts" />

/// <reference path='../service/ProjectService.ts' />

module controller {
    var Q = require('q');

    export class ProjectController {

        private getProjectService:service.GetProjectService;
        private updateProjectService:service.UpdateProjectService;
        private deleteProjectService:service.DeleteProjectService;

        constructor(getProject : service.GetProjectService,
                    updateProject : service.UpdateProjectService,
                    deleteProject : service.DeleteProjectService) {
            this.getProjectService = getProject;
            this.updateProjectService = updateProject;
            this.deleteProjectService = deleteProject;
        }

        public putAuthLevel = model.AuthenticationLevel.User;

        public put(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            var validateDto = validate.ValidateUpdateProjectDto(request.body);
            if (!validateDto.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validateDto.reason }));

            /// TODO:- Move to Authorisation Service
            return this.getProjectService.byName(request.parameters.target)
                .then((project:model.db.Project):Q.IPromise<model.HttpResponse> => {
                    if (project) {
                        if (request.user.authLevel < model.AuthenticationLevel.Super && project.userId !== request.user.id)
                            return Q(new model.HttpResponse(403, { "code": "Forbidden" }));

                        return this.updateProjectService.byName(project.name, request.body)
                            .then((project: model.db.Project) => {
                                return Q(new model.HttpResponse(200, {
                                    "git": project.git
                                }));
                            });
                    }
                    return Q(new model.HttpResponse(404, {
                        "code": "ResourceNotFound",
                        "message": "Project not found"
                    }));
                });
        }

        public delAuthLevel = model.AuthenticationLevel.User;

        public del(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            /// TODO:- Move to Authorisation Service
            return this.getProjectService.byName(request.parameters.target)
                .then((project:model.db.Project):Q.IPromise<model.HttpResponse> => {
                    if (!project)
                        return Q(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Project not found" }));
                    if (request.user.authLevel < model.AuthenticationLevel.Super && project.userId !== request.user.id)
                        return Q(new model.HttpResponse(403, { "code": "Forbidden" }));

                    return this.deleteProjectService.byName(request.parameters.target)
                        .then(function () {
                            return new model.HttpResponse(204, { });
                        });
                });
        }

        public get(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.getProjectService.byName(request.parameters.target)
                .then((project:model.db.Project) => {
                    if (project)
                        return new model.HttpResponse(200, { "git": project.git });

                    return new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Project not found" });
                });
        }
    }
}
