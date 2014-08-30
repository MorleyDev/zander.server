module controller.impl {
    var Q = require('q');

    export class ProjectCollectionControllerImpl implements ProjectCollectionController {

        private host:string;
        private createProjectService:service.CreateProjectService;

        constructor(host:string, createProjectService:service.CreateProjectService) {
            this.host = host;
            this.createProjectService = createProjectService;
        }

        public postAuthLevel = model.AuthenticationLevel.User;
        public postValidator = new validate.impl.CreateProjectDtoValidator();

        public post(request:model.HttpRequest): Q.IPromise<model.HttpResponse> {
            return this.createProjectService.forUser(request.user, request.body)
                .then((project:model.db.Project) => {
                    if (!project)
                        return new model.HttpResponse(409, {
                            "code": "Conflict",
                            "message": "Project already exists"
                        });

                    return new model.HttpResponse(201, {
                        _href: this.host + "/project/" + project.name,
                        git: project.git
                    });
                });
        }
    }
}
