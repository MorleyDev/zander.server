module controller.impl {
    var Q = require('q');

    export class ProjectControllerImpl implements ProjectController {
        private authorisationService:service.AuthorisationService;
        private getProjectService:service.GetProjectService;
        private updateProjectService:service.UpdateProjectService;
        private deleteProjectService:service.DeleteProjectService;

        constructor(authorise:service.AuthorisationService,
                    getProject:service.GetProjectService,
                    updateProject:service.UpdateProjectService,
                    deleteProject:service.DeleteProjectService) {
            this.authorisationService = authorise;
            this.getProjectService = getProject;
            this.updateProjectService = updateProject;
            this.deleteProjectService = deleteProject;
        }

        public putAuthLevel = model.AuthenticationLevel.User;
        public delAuthLevel = model.AuthenticationLevel.User;
        public getAuthLevel = model.AuthenticationLevel.None;

        public getValidator = new validate.impl.ProjectTargetValidator();
        public delValidator = new validate.impl.ProjectTargetValidator();
        public putValidator = new validate.impl.UpdateProjectDtoValidator();

        public put(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.authorisationService.forProject(request.user, request.parameters.target).then((authorised: service.AuthorisationResult) => {
                switch (authorised) {
                    case service.AuthorisationResult.NotFound:
                        return Q(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Resource Not Found" }));

                    case service.AuthorisationResult.Failure:
                        return Q(new model.HttpResponse(403, { "code": "Forbidden" }));

                    case service.AuthorisationResult.Success:
                        return this.updateProjectService.byName(request.parameters.target, request.body)
                            .then((project:model.db.Project) => {
                                return Q(new model.HttpResponse(200, { "git": project.git }));
                            });
                }
            });
        }

        public del(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.authorisationService.forProject(request.user, request.parameters.target).then((authorised: service.AuthorisationResult) => {
                switch (authorised) {
                    case service.AuthorisationResult.NotFound:
                        return Q(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Resource Not Found" }));

                    case service.AuthorisationResult.Failure:
                        return Q(new model.HttpResponse(403, { "code": "Forbidden" }));

                    case service.AuthorisationResult.Success:
                        return this.deleteProjectService.byName(request.parameters.target)
                            .then(function () {
                                return new model.HttpResponse(204, { });
                            });
                }
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
