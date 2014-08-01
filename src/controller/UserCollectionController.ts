/// <reference path='../service/ProjectService.ts'/>
/// <reference path='../service/UserService.ts'/>
/// <reference path='../service/AuthenticationService.ts'/>
/// <reference path='../validate/ValidateUserDto.ts'/>
/// <reference path='../model/Configuration.ts'/>

module controller {
    var Q = require('q');

    export class UserCollectionController {
        private host:string;
        private createUserService:service.CreateUserService;

        constructor(host:string, createUserService:service.CreateUserService) {
            this.host = host;
            this.createUserService = createUserService;
        }

        public postAuthLevel = model.AuthenticationLevel.Super;

        public post(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            var validation = validate.ValidateCreateUserDto(request.body);
            if (!validation.success)
                return Q(new model.HttpResponse(400, {
                    "code": "BadRequest",
                    "message": validation.reason
                }));

            return this.createUserService.fromDto(request.body).then((user) => {
                if (!user)
                    return Q(new model.HttpResponse(409, {
                        "code": "Conflict",
                        "message": "User already exists"
                    }));

                return new model.HttpResponse(201, {
                    "email": user.email,
                    "username": user.username,
                    "_href": this.host + "/user/" + user.username
                });
            });
        }
    }
}
