/// <reference path='../service/AuthenticationService.ts'/>
/// <reference path='../validate/ValidateUserDto.ts'/>
/// <reference path='../data/UserRepository.ts'/>
/// <reference path='../data/ProjectRepository.ts'/>
/// <reference path='../model/Configuration.ts'/>

module controller {
    var Q = require('q');

    export class UserController {

        private getUserService:service.GetUserService;
        private updateUserService:service.UpdateUserService;
        private deleteUserService:service.DeleteUserService;

        constructor(getUser:service.GetUserService, updateUser:service.UpdateUserService, deleteUser:service.DeleteUserService) {
            this.getUserService = getUser;
            this.updateUserService = updateUser;
            this.deleteUserService = deleteUser;
        }

        public putAuthLevel = model.AuthenticationLevel.User;

        public put(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            if (request.user.authLevel < model.AuthenticationLevel.Super && request.parameters.target !== request.user.name)
                return Q(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Resource Not Found" }));

            var validation = validate.ValidateUpdateUserDto(request.body);
            if (!validation.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validation.reason }));

            return this.updateUserService.withUsername(request.parameters.target, request.body)
                .then((user:model.db.User):Q.IPromise<model.HttpResponse> => {
                    if (!user)
                        return Q(new model.HttpResponse(404, {
                            "code": "ResourceNotFound",
                            "message": "User not found"
                        }));

                    return Q(new model.HttpResponse(200, { "email": user.email }));
                });
        }

        public delAuthLevel = model.AuthenticationLevel.User;

        public del(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            var validateUsername = validate.ValidateUsername(request.parameters.target);
            if (!validateUsername.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validateUsername.reason }));

            // TODO:- move over to authorisation service
            return this.getUserService.byUsername(request.parameters.target)
                .then((user:model.db.User):Q.IPromise<model.HttpResponse> => {
                    if (!user)
                        return Q(new model.HttpResponse(404, { }));

                    if (request.user.authLevel < model.AuthenticationLevel.Super && request.user.id !== user.id)
                        return Q(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Resource Not Found" }));

                    return this.deleteUserService.byUser(user)
                        .then(() => {
                            return new model.HttpResponse(204, { });
                        });
                });
        }

        public getAuthLevel = model.AuthenticationLevel.User;

        public get(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {

            var validation = validate.ValidateUsername(request.parameters.target);
            if (!validation.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validation.reason }));

            return this.getUserService.byUsername(request.parameters.target)
                .then((user:model.db.User):Q.IPromise<model.HttpResponse> => {
                    if (!user)
                        return Q(new model.HttpResponse(404, {
                            "code": "ResourceNotFound",
                            "message": "User not found"
                        }));

                    // TODO:- move over to authorisation service
                    if (request.user.authLevel < model.AuthenticationLevel.Super && request.user.id !== user.id)
                        return Q(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Resource Not Found" }));

                    return Q(new model.HttpResponse(200, { "email": user.email }));
                });
        }
    }
}
