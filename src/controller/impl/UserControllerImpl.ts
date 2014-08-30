
module controller.impl {
    var Q = require('q');

    export class UserControllerImpl implements UserController {
        private getUserService:service.GetUserService;
        private updateUserService:service.UpdateUserService;
        private deleteUserService:service.DeleteUserService;

        constructor(getUser:service.GetUserService, updateUser:service.UpdateUserService, deleteUser:service.DeleteUserService) {
            this.getUserService = getUser;
            this.updateUserService = updateUser;
            this.deleteUserService = deleteUser;
        }

        public putAuthLevel = model.AuthenticationLevel.User;
        public delAuthLevel = model.AuthenticationLevel.User;
        public getAuthLevel = model.AuthenticationLevel.User;

        public getValidator = "username";
        public putValidator = "UpdateUserDto";
        public delValidator = "username";

        public putAuthoriser:string = "user";
        public delAuthoriser:string = "user";
        public getAuthoriser:string = "user";

        public put(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.updateUserService.withUsername(request.parameters.target, request.body)
                .then((user:model.db.User):Q.IPromise<model.HttpResponse> => {
                    return Q(new model.HttpResponse(200, { "email": user.email }));
                });
        }

        public del(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.deleteUserService.byUsername(request.parameters.target)
                .then(() => { return new model.HttpResponse(204, { }); });
        }

        public get(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.getUserService.byUsername(request.parameters.target)
                .then((user:model.db.User):Q.IPromise<model.HttpResponse> => {
                    return Q(new model.HttpResponse(200, { "email": user.email }));
                });
        }
    }
}
