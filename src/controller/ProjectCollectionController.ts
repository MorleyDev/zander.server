/// <reference path='../validate/ValidateProjectDto.ts' />
/// <reference path='../service/ProjectService.ts' />
/// <reference path="../../typings/Q/Q.d.ts" />

module controller {

    export class ProjectCollectionController {

        private host:string;
        private createProjectService: service.CreateProjectService;

        constructor(host:string, createProjectService:service.CreateProjectService) {
            this.host = host;
            this.createProjectService = createProjectService;
        }

        public postAuthLevel = model.AuthenticationLevel.User;

        public post(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            var result = validate.ValidateCreateProjectDto(request.body);
            if (!result.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": result.reason }));

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
