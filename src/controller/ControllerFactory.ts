/// <reference path="../service/ServiceFactory.ts" />
/// <reference path="ProjectCollectionController.ts" />
/// <reference path="ProjectController.ts" />
/// <reference path="UserCollectionController.ts" />
/// <reference path="UserController.ts" />
/// <reference path="VerifyController.ts" />

module controller {
    export class ControllerFactory {
        constructor(configuration:model.Configuration, services:service.ServiceFactory) {
            this.verify = new controller.VerifyController();
            this.user = new controller.UserController(services.user.read, services.user.update, services.user.deletion);
            this.users = new controller.UserCollectionController(configuration.host, services.user.create);
            this.project = new controller.ProjectController(services.project.read, services.project.update, services.project.deletion);
            this.projects = new controller.ProjectCollectionController(configuration.host, services.project.create);
        }

        public verify:controller.VerifyController;
        public user:controller.UserController;
        public users:controller.UserCollectionController;
        public project:controller.ProjectController;
        public projects:controller.ProjectCollectionController;
    }
}
