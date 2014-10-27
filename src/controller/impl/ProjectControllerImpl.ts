module controller.impl {
    var Q = require('q');

    export class ProjectControllerImpl implements ProjectController {
        private getProjectService:service.GetProjectService;
        private updateProjectService:service.UpdateProjectService;
        private deleteProjectService:service.DeleteProjectService;

        constructor(getProject:service.GetProjectService,
                    updateProject:service.UpdateProjectService,
                    deleteProject:service.DeleteProjectService) {
            this.getProjectService = getProject;
            this.updateProjectService = updateProject;
            this.deleteProjectService = deleteProject;
        }

        public putAuthLevel = model.AuthenticationLevel.User;
        public delAuthLevel = model.AuthenticationLevel.User;
        public getAuthLevel = model.AuthenticationLevel.None;

        public getValidator = "ProjectName";
        public delValidator = "ProjectName";
        public putValidator = "UpdateProjectDto";

        public putAuthoriser : string = "project";
        public delAuthoriser : string = "project";
        public getAuthoriser : string = null;

        public put(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.updateProjectService.byName(request.parameters.target, request.body)
                .then((project:model.db.Project) => {
                    return Q(new model.HttpResponse(200, { 
                        "src": {
                            "vcs": "git",
                            "href": project.git
                        }
                    }));
                });
        }

        public del(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.deleteProjectService.byName(request.parameters.target)
                .then(function () {
                    return new model.HttpResponse(204, { });
                });
        }


        public get(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.getProjectService.byName(request.parameters.target)
                .then((project:model.db.Project) => {
                    if (!project)
                        return new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Project not found" });
                    
                    return new model.HttpResponse(200, { 
                        "src": {
                            "vcs": "git",
                            "href": project.git
                        }
                    });
                });
        }
    }
}
