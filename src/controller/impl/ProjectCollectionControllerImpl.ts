module controller.impl {
    var Q = require('q');

    export class ProjectCollectionControllerImpl implements ProjectCollectionController {

        private host:string;
        private createProjectService:service.CreateProjectService;
        private getProjectCollectionService:service.GetProjectCollectionService;

        constructor(host:string,
                    createProjectService:service.CreateProjectService,
                    getProjectCollectionService: service.GetProjectCollectionService) {
            this.host = host;
            this.createProjectService = createProjectService;
            this.getProjectCollectionService = getProjectCollectionService;
        }

        public postAuthLevel = model.AuthenticationLevel.User;
        public postValidator = "CreateProjectDto";
        public postAuthoriser : string = null;

        public getAuthLevel = model.AuthenticationLevel.None;
        public getValidator : string = "ProjectCollection";
        public getAuthoriser : string = null;
        
        public post(request:model.HttpRequest): Q.IPromise<model.HttpResponse> {
            return this.createProjectService.forUser(request.user, request.body)
                .then((project:model.db.Project) => {
                    if (!project)
                        return new model.HttpResponse(409, {
                            "code": "Conflict",
                            "message": "Project already exists"
                        });

                    return new model.HttpResponse(201, {
                        "_href": this.host + "/project/" + project.name,
                        "git": project.git
                    });
                });
        }
        
        public get(request: model.HttpRequest) : Q.IPromise<model.HttpResponse> {
            var startIndex = request.query["start"] || 0;
            var reqCount = request.query["count"] || 100;
            
            return ((): Q.IPromise<number> => {
                if (request.query["name.contains"])
                    return this.getProjectCollectionService.countContainsName(request.query["name.contains"]);
    
                return this.getProjectCollectionService.count();
            })().then((count) => {
                return ((): Q.IPromise<model.db.Project[]> => {
                    if (request.query["name.contains"])
                        return this.getProjectCollectionService.pagedContainsName(request.query["name.contains"], startIndex, reqCount);
        
                    return this.getProjectCollectionService.paged(startIndex,reqCount);
                })().then((result) => {
                    return new model.HttpResponse(200, {
                        "_count": result.length,
                        "_total": count,
                        "projects": result.map((name) => {
                            return {
                                "name": name,
                                "_href": this.host + "/project/" + name
                            };
                        })
                    });
                });
            });
        }
    }
}
