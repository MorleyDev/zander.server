/// <reference path='../service/AuthenticationService.ts'/>
/// <reference path='../validate/ValidateUserDto.ts'/>
/// <reference path='../data/UserRepository.ts'/>
/// <reference path='../data/ProjectRepository.ts'/>
/// <reference path='../model/Configuration.ts'/>

var Q = require('q');

module controller {

    export class UserController {

        private configuration : model.Configuration;
        private authenticationService:service.AuthenticationService;
        private userRepository:data.UserRepository;
        private projectRepository:data.ProjectRepository;

        constructor(configuration : model.Configuration, authenticateUser:service.AuthenticationService, userRepository:data.UserRepository, deleteProjects:data.ProjectRepository) {
            this.configuration = configuration;
            this.authenticationService = authenticateUser;
            this.userRepository = userRepository;
            this.projectRepository = deleteProjects
        }

        public post(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return Q(new model.HttpResponse(405, {
                "code": "MethodNotAllowed",
                "message": "POST not supported on user"
            }));
        }

        public put(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.authenticationService.atLeastUser(request.authorization, (login:model.LoggedInUserDetails):Q.IPromise<model.HttpResponse> => {
                if (!login.isSuper && request.parameters.target != login.username)
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
            });
        }

        public del(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.authenticationService.atLeastUser(request.authorization, (login:model.LoggedInUserDetails):Q.IPromise<model.HttpResponse> => {
                if (!login.isSuper && request.parameters.target != login.username)
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
            });
        }

        public get(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.authenticationService.atLeastUser(request.authorization, (login:model.LoggedInUserDetails):Q.IPromise<model.HttpResponse> => {
                if (!login.isSuper && request.parameters.target != login.username)
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
            });
        }
    }
}
