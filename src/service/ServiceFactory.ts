/// <reference path="../data/DataFactory.ts" />
/// <reference path="ProjectService.ts" />
/// <reference path="UserService.ts" />
/// <reference path="AuthenticationService.ts" />

module service {
    export class ProjectServiceFactory {
        constructor(datas:data.DataFactory) {
            this.create = new service.CreateProjectService(datas.project);
            this.read = new service.GetProjectService(datas.project);
            this.update = new service.UpdateProjectService(datas.project);
            this.deletion = new service.DeleteProjectService(datas.project);
        }

        public create:service.CreateProjectService;
        public read:service.GetProjectService;
        public update:service.UpdateProjectService;
        public deletion:service.DeleteProjectService;
    }

    export class UserServiceFactory {
        constructor(datas:data.DataFactory) {
            this.create = new service.CreateUserService(datas.user);
            this.read = new service.GetUserService(datas.user);
            this.update = new service.UpdateUserService(datas.user);
            this.deletion = new service.DeleteUserService(datas.user, datas.project);
        }

        public create:service.CreateUserService;
        public read:service.GetUserService;
        public update:service.UpdateUserService;
        public deletion:service.DeleteUserService;
    }

    export class ServiceFactory {
        constructor(datas:data.DataFactory) {
            this.project = new ProjectServiceFactory(datas);
            this.user = new UserServiceFactory(datas);
            this.authenticate = new service.AuthenticationService(datas.authenticate);
        }

        public project:ProjectServiceFactory;
        public user:UserServiceFactory;
        public authenticate:service.AuthenticationService;
    }
}
