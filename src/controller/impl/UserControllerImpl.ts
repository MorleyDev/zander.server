
module controller.impl {
    var Q = require('q');

    export class UserControllerImpl implements UserController {
        private authorisationService:service.AuthorisationService;
        private getUserService:service.GetUserService;
        private updateUserService:service.UpdateUserService;
        private deleteUserService:service.DeleteUserService;

        constructor(authorise:service.AuthorisationService,
                    getUser:service.GetUserService,
                    updateUser:service.UpdateUserService,
                    deleteUser:service.DeleteUserService) {
            this.authorisationService = authorise;
            this.getUserService = getUser;
            this.updateUserService = updateUser;
            this.deleteUserService = deleteUser;
        }

        public putAuthLevel = model.AuthenticationLevel.User;
        public delAuthLevel = model.AuthenticationLevel.User;
        public getAuthLevel = model.AuthenticationLevel.User;

        public getValidator:validate.Validator = new validate.impl.UsernameTargetValidator();
        public putValidator:validate.Validator = new validate.impl.UpdateUserDtoValidator();
        public delValidator:validate.Validator = new validate.impl.UsernameTargetValidator();

        public put(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.authorisationService.forUser(request.user, request.parameters.target)
                .then((authorised:service.AuthorisationResult) => {
                    switch (authorised) {
                        case service.AuthorisationResult.NotFound:
                        case service.AuthorisationResult.Failure:
                            return Q(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Resource Not Found" }));

                        case service.AuthorisationResult.Success:
                            return this.updateUserService.withUsername(request.parameters.target, request.body)
                                .then((user:model.db.User):Q.IPromise<model.HttpResponse> => {
                                    return Q(new model.HttpResponse(200, { "email": user.email }));
                                });
                    }
                });
        }

        public del(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.authorisationService.forUser(request.user, request.parameters.target)
                .then((authorised:service.AuthorisationResult) => {
                    switch (authorised) {
                        case service.AuthorisationResult.NotFound:
                        case service.AuthorisationResult.Failure:
                            return Q(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Resource Not Found" }));

                        case service.AuthorisationResult.Success:
                            return this.deleteUserService.byUsername(request.parameters.target)
                                .then(() => { return new model.HttpResponse(204, { }); });
                    }
                });
        }

        public get(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.authorisationService.forUser(request.user, request.parameters.target)
                .then((authorised:service.AuthorisationResult) => {
                    switch (authorised) {
                        case service.AuthorisationResult.NotFound:
                        case service.AuthorisationResult.Failure:
                            return Q(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Resource Not Found" }));

                        case service.AuthorisationResult.Success:
                            return this.getUserService.byUsername(request.parameters.target)
                                .then((user:model.db.User):Q.IPromise<model.HttpResponse> => {
                                    return Q(new model.HttpResponse(200, { "email": user.email }));
                                });
                    }
                });
        }
    }
}
