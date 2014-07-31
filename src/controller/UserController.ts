/// <reference path='../service/AuthenticationService.ts'/>
/// <reference path='../validate/ValidateUserDto.ts'/>
/// <reference path='../data/UserRepository.ts'/>
/// <reference path='../data/ProjectRepository.ts'/>
/// <reference path='../model/Configuration.ts'/>

var Q = require('q');

module controller {

    export class UserController {

        private userRepository:data.UserRepository;
        private projectRepository:data.ProjectRepository;

        constructor(userRepository:data.UserRepository, deleteProjects:data.ProjectRepository) {
            this.userRepository = userRepository;
            this.projectRepository = deleteProjects;
        }


        public postAuthLevel = model.AuthenticationLevel.None;
        public post(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return Q(new model.HttpResponse(405, {
                "code": "MethodNotAllowed",
                "message": "POST not supported on user"
            }));
        }

        public putAuthLevel = model.AuthenticationLevel.User;
        public put(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            if (request.user.authLevel < model.AuthenticationLevel.Super && request.parameters.target !== request.user.username)
                return Q(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Resource Not Found" }));

            var validation = validate.ValidateUpdateUserDto(request.body);
            if (!validation.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validation.reason }));

            return this.userRepository.getUser(request.parameters.target)
                .then((user) => {
                    if (!user)
                        return new model.HttpResponse(404, {
                            "code": "ResourceNotFound",
                            "message": "User not found"
                        });

                    return this.userRepository.updateUser(user.id, request.body.email, request.body.password).then((id) => {
                        return new model.HttpResponse(200, { "email": request.body.email });
                    });
                });
        }

        public delAuthLevel = model.AuthenticationLevel.User;
        public del(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            if (request.user.authLevel < model.AuthenticationLevel.Super && request.parameters.target !== request.user.username)
                return Q(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Resource Not Found" }));

            var validateUsername = validate.ValidateUsername(request.parameters.target);
            if (!validateUsername.success)
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validateUsername.reason }));

            return this.userRepository.getUser(request.parameters.target)
                .then((user) => {
                    if (!user)
                        return new model.HttpResponse(404, { });

                    return this.projectRepository.deleteUsersProjects(user.id).then(() => {
                        return this.userRepository.deleteUser(user.username).then(() => {
                            return new model.HttpResponse(204, { });
                        });
                    });
                });
        }

        public getAuthLevel = model.AuthenticationLevel.User;
        public get(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            if (request.user.authLevel < model.AuthenticationLevel.Super && request.parameters.target !== request.user.username)
                return Q(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Resource Not Found" }));

            var validation = validate.ValidateUsername(request.parameters.target);
            if (validation.success)
                return this.userRepository.getUser(request.parameters.target)
                    .then((user) => {
                        if (user)
                            return new model.HttpResponse(200, { "email": user.email });
                        else
                            return new model.HttpResponse(404, {
                                "code": "ResourceNotFound",
                                "message": "User not found"
                            });
                    });
            else
                return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validation.reason }));
        }
    }
}
