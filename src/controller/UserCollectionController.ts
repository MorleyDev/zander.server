/// <reference path='../service/AuthenticationService.ts'/>
/// <reference path='../validate/ValidateUserDto.ts'/>
/// <reference path='../data/UserRepository.ts'/>
/// <reference path='../data/ProjectRepository.ts'/>
/// <reference path='../model/Configuration.ts'/>

var Q = require('q');

module controller {
    export class UserCollectionController {
        private host:string;
        private userRepository:data.UserRepository;
        private projectRepository:data.ProjectRepository;

        constructor(host:string, userRepository:data.UserRepository, deleteProjects:data.ProjectRepository) {
            this.host = host;
            this.userRepository = userRepository;
            this.projectRepository = deleteProjects;
        }

        public postAuthLevel = model.AuthenticationLevel.Super;

        public post(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            var validation = validate.ValidateCreateUserDto(request.body);
            if (!validation.success)
                return Q(new model.HttpResponse(400, {
                    "code": "BadRequest",
                    "message": validation.reason
                }));

            return this.userRepository.getUser(request.body.username)
                .then((user:model.db.User) => {
                    if (user)
                        return new model.HttpResponse(409, {
                            "code": "Conflict",
                            "message": "User already exists"
                        });

                    return this.userRepository.createUser(request.body.username, request.body.email, request.body.password).then(() => {
                        return new model.HttpResponse(201, {
                            "email": request.body.email,
                            "username": request.body.username,
                            "_href": this.host + "/user/" + request.body.username
                        });
                    });
                });
        }
    }
}
