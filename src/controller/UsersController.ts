/// <reference path='../service/AuthenticationService.ts'/>
/// <reference path='../validate/ValidateUserDto.ts'/>
/// <reference path='../data/UserRepository.ts'/>
/// <reference path='../data/ProjectRepository.ts'/>
/// <reference path='../model/Configuration.ts'/>

var Q = require('q');

module controller {

    export class UsersController {

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
            return this.authenticationService.atLeastSuper(request.authorization, (login:model.LoggedInUserDetails):Q.IPromise<model.HttpResponse> => {
                var validation = validate.ValidateCreateUserDto(request.body);
                if (!validation.success)
                    return Q(new model.HttpResponse(400, {
                        "code": "BadRequest",
                        "message": validation.reason
                    }));

                return this.userRepository.getUser(request.body.username).then((user) => {
                    if (user)
                        return new model.HttpResponse(409, {
                            "code": "Conflict",
                            "message": "User already exists"
                        });

                    return this.userRepository.createUser(request.body.username, request.body.email, request.body.password).then(() => {
                        return new model.HttpResponse(201, {
                            "email": request.body.email,
                            "username": request.body.username,
                            "_href": this.configuration.host + "/user/" + request.body.username
                        });
                    });
                });
            });
        }

        public put(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return Q(new model.HttpResponse(405, {
                "code": "MethodNotAllowed",
                "message": "Missing Url Arguments"
            }));
        }

        public del(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return Q(new model.HttpResponse(405, {
                "code": "MethodNotAllowed",
                "message": "Missing Url Arguments"
            }));
        }

        public get(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return Q(new model.HttpResponse(405, { "code": "MethodNotAllowed",
                "message": "Missing Url Arguments"
            }));
        }
    }
}
