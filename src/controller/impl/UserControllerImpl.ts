
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

        public put(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            var validation = validate.ValidateUpdateUserDto(request.body);
            if (!validation.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validation.reason }));

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

        public delAuthLevel = model.AuthenticationLevel.User;

        public del(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            var validateUsername = validate.ValidateUsername(request.parameters.target);
            if (!validateUsername.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validateUsername.reason }));

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

        public getAuthLevel = model.AuthenticationLevel.User;

        public get(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {

            var validation = validate.ValidateUsername(request.parameters.target);
            if (!validation.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validation.reason }));

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
