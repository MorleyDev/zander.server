module service {
    export class ProjectServiceFactory {
        constructor(datas:data.DataFactory) {
            this.create = new service.impl.CreateProjectServiceImpl(datas.project);
            this.read = new service.impl.GetProjectServiceImpl(datas.project);
            this.update = new service.impl.UpdateProjectServiceImpl(datas.project);
            this.deletion = new service.impl.DeleteProjectServiceImpl(datas.project);
            
            this.readCollection = new service.impl.GetProjectCollectionServiceImpl(datas.project);
        }

        public create:service.CreateProjectService;
        public read:service.GetProjectService;
        public update:service.UpdateProjectService;
        public deletion:service.DeleteProjectService;
        
        public readCollection: service.GetProjectCollectionService;
    }

    export class UserServiceFactory {
        constructor(datas:data.DataFactory) {
            this.create = new service.impl.CreateUserServiceImpl(datas.user);
            this.read = new service.impl.GetUserServiceImpl(datas.user);
            this.update = new service.impl.UpdateUserServiceImpl(datas.user);
            this.deletion = new service.impl.DeleteUserServiceImpl(datas.user, datas.project);
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
            this.authorisers = new AuthorisationFactory(datas);
            this.authenticate = new service.impl.AuthenticationServiceImpl(datas.authenticate);
        }

        public project:ProjectServiceFactory;
        public user:UserServiceFactory;
        public authorisers: service.AuthorisationFactory;
        public authenticate:AuthenticationService;
    }
}
