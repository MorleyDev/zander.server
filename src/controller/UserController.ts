/// <reference path="../model/HttpResponse.ts" />
/// <reference path="../model/HttpRequest.ts" />
/// <reference path="../model/dto/CreateUserDto.ts" />
/// <reference path="../validate/ValidateUserDto.ts" />
/// <reference path="../service/AuthenticateUserAsTarget.ts" />
/// <reference path="../data/user/CRUD.ts" />
/// <reference path="../data/project/CRUD.ts" />

var Q = require('q');

module controller {

    export class UserController {

        private configuration;
        private authenticateUserAndRespond : service.AuthenticateUserAndRespond;
        private createUser : data.user.CreateUserInDatabase;
        private getUser : data.user.GetUserFromDatabase;
        private deleteUser : data.user.DeleteUserFromDatabase;
        private updateUser : data.user.UpdateUserInDatabase;
        private deleteProjects : data.project.DeleteUsersProjectsFromDatabase;

        constructor(configuration,
                    authenticateUser : service.AuthenticateUserAndRespond,
                    createUser : data.user.CreateUserInDatabase,
                    getUser : data.user.GetUserFromDatabase,
                    deleteUser : data.user.DeleteUserFromDatabase,
                    updateUser : data.user.UpdateUserInDatabase,
                    deleteProjects : data.project.DeleteUsersProjectsFromDatabase) {
            this.configuration = configuration;
            this.authenticateUserAndRespond = authenticateUser;
            this.createUser = createUser;
            this.getUser = getUser;
            this.deleteUser = deleteUser;
            this.updateUser = updateUser;
            this.deleteProjects = deleteProjects
        }

        public post(request : model.HttpRequest) : Q.IPromise<model.HttpResponse> {

            if (request.parameters.target)
                return Q(new model.HttpResponse(405, {
                    "code": "MethodNotAllowed",
                    "message": "POST not supported on user"
                }));

            return this.authenticateUserAndRespond.atLeastSuper(request.authorization, (login:service.LogInResult):Q.IPromise<model.HttpResponse> => {
                var validation = validate.ValidateCreateUserDto(request.body);
                if (!validation.success)
                    return Q(new model.HttpResponse(400, {
                        "code": "BadRequest",
                        "message": validation.reason
                    }));

                return this.getUser.run(request.body.username).then((user) => {
                    if (user)
                        return new model.HttpResponse(409, {
                            "code": "Conflict",
                            "message": "User already exists"
                        });

                    return this.createUser.run(request.body.username, request.body.email, request.body.password).then(() => {
                        return new model.HttpResponse(201, {
                            "email": request.body.email,
                            "username": request.body.username,
                            "_href": this.configuration.host + "/user/" + request.body.username
                        });
                    });
                });
            });
        }

        public put(request : model.HttpRequest) : Q.IPromise<model.HttpResponse> {
            if (!request.parameters.target)
                return Q(new model.HttpResponse(405, {
                    "code": "MethodNotAllowed",
                    "message": "Missing Url Arguments"
                }));

            return this.authenticateUserAndRespond.atLeastIsUser(request.authorization, request.parameters.target, (login:service.LogInResult):Q.IPromise<model.HttpResponse> => {
                var validation = validate.ValidateUpdateUserDto(request.body);
                if (!validation.success)
                    return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validation.reason }));

                return this.getUser.run(request.parameters.target)
                    .then((user) => {
                        return this.updateUser.run(user.id, request.body.email, request.body.password).then((id) => {
                            return new model.HttpResponse(200, { "email": request.body.email });
                        });
                    });
            });
        }

        public del(request : model.HttpRequest) : Q.IPromise<model.HttpResponse> {
            if (!request.parameters.target)
                return Q(new model.HttpResponse(405, {
                    "code": "MethodNotAllowed",
                    "message": "Missing Url Arguments"
                }));

            return this.authenticateUserAndRespond.atLeastIsUser(request.authorization, request.parameters.target, (result:service.LogInResult):Q.IPromise<model.HttpResponse> => {
                var validateUsername = validate.ValidateUsername(request.parameters.target);
                if (!validateUsername.success)
                    return Q(new model.HttpResponse(400, { "code": "BadRequest", "message": validateUsername.reason }));

                return this.getUser
                    .run(request.parameters.target)
                    .then((user) => {
                        if (!user)
                            return new model.HttpResponse(404, { });

                        return this.deleteProjects.run(user.id).then(() => {
                            return this.deleteUser.run(user.username).then(() => {
                                return new model.HttpResponse(204, { });
                            });
                        });
                    });
            });
        }

        public get(request : model.HttpRequest) : Q.IPromise<model.HttpResponse> {
            if (!request.parameters.target)
                return Q(new model.HttpResponse(405, { "code": "MethodNotAllowed",
                    "message": "Missing Url Arguments"
                }));

            return this.authenticateUserAndRespond.atLeastIsUser(request.authorization, request.parameters.target,
                (loginUser:service.LogInResult):Q.IPromise<model.HttpResponse> => {
                    return this.getUserAsResponse(request.parameters.target);
                });
        }

        private getUserAsResponse(username) : Q.IPromise<model.HttpResponse> {
            var validation = validate.ValidateUsername(username);
            if (validation.success)
                return this.getUser.run(username)
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
