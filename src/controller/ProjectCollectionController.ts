/// <reference path='../validate/ValidateProjectDto.ts' />
/// <reference path='../data/ProjectRepository.ts' />
/// <reference path='../model/Configuration.ts' />
/// <reference path="../../typings/Q/Q.d.ts" />

module controller {
    export class ProjectCollectionController {

        private host:string;
        private projectRepository:data.ProjectRepository;

        constructor(host:string, projectRepository:data.ProjectRepository) {
            this.host = host;
            this.projectRepository = projectRepository;
        }

        public postAuthLevel = model.AuthenticationLevel.User;

        public post(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            var result = validate.ValidateCreateProjectDto(request.body);
            if (!result.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": result.reason }));

            return this.projectRepository.getProject(request.body.name)
                .then((project:model.db.Project) => {
                    if (project)
                        return new model.HttpResponse(409, {
                            "code": "Conflict",
                            "message": "Project already exists"
                        });
                    return this.projectRepository.createProject(request.user.id, request.body.name, request.body.git)
                        .then(() => {
                            return new model.HttpResponse(201, {
                                _href: this.host + "/project/" + request.body.name,
                                git: request.body.git
                            });
                        });
                });
        }
    }
}
