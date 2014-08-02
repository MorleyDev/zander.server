module controller {
    export class ControllerFactory {
        constructor(configuration:model.Configuration, services:service.ServiceFactory) {
            this.verify = new controller.impl.VerifyControllerImpl();
            this.user = new controller.impl.UserControllerImpl(services.user.read, services.user.update, services.user.deletion);
            this.users = new controller.impl.UserCollectionControllerImpl(configuration.host, services.user.create);
            this.project = new controller.impl.ProjectControllerImpl(services.project.read, services.project.update, services.project.deletion);
            this.projects = new controller.impl.ProjectCollectionControllerImpl(configuration.host, services.project.create);
        }

        public verify:controller.VerifyController;
        public user:controller.UserController;
        public users:controller.UserCollectionController;
        public project:controller.ProjectController;
        public projects:controller.ProjectCollectionController;
    }
}
