/// <reference path="../model/HttpResponse.ts" />
/// <reference path="../model/HttpRequest.ts" />
/// <reference path="../model/dto/CreateUserDto.ts" />
/// <reference path="../validate/ValidateUserDto.ts" />
/// <reference path="../service/AuthenticateUserAsTarget.ts" />
/// <reference path="../data/user/CRUD.ts" />
/// <reference path="../data/project/CRUD.ts" />

var q = require('q');

module controller {

    export class UserController {

        private configuration;
        private authenticateUser : service.AuthenticateUserAsTarget;
        private authenticateUserAndRespond : service.AuthenticateUserAndRespond;
        private createUser : data.user.CreateUserInDatabase;
        private getUser : data.user.GetUserFromDatabase;
        private deleteUser : data.user.DeleteUserFromDatabase;
        private updateUser : data.user.UpdateUserInDatabase;
        private deleteProjects : data.project.DeleteUsersProjectsFromDatabase;

        constructor(configuration,
                    authenticateUser : service.AuthenticateUserAsTarget,
                    authenticateUserAndRespond : service.AuthenticateUserAndRespond,
                    createUser : data.user.CreateUserInDatabase,
                    getUser : data.user.GetUserFromDatabase,
                    deleteUser : data.user.DeleteUserFromDatabase,
                    updateUser : data.user.UpdateUserInDatabase,
                    deleteProjects : data.project.DeleteUsersProjectsFromDatabase) {
            this.configuration = configuration;
            this.authenticateUser = authenticateUser;
            this.authenticateUserAndRespond = authenticateUserAndRespond;
            this.createUser = createUser;
            this.getUser = getUser;
            this.deleteUser = deleteUser;
            this.updateUser = updateUser;
            this.deleteProjects = deleteProjects
        }

        public post(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {

            var createUser = this.createUser;
            var getUser = this.getUser;
            var configuration = this.configuration;

            if (request.parameters.target) {
                callback(new model.HttpResponse(405, {
                    "code": "MethodNotAllowed",
                    "message": "POST not supported on user"
                }));
            } else {
                this.authenticateUser.authenticate(true, request.authorization, null, (user) => {

                    var createUserDto:model.dto.CreateUserDto = request.body;
                    validate.ValidateCreateUserDto(createUserDto, (createUserDto:model.dto.CreateUserDto) => {
                        getUser.execute(createUserDto.username, (err, user) => {
                            if (err) {
                                request.log.error(err);
                                callback(new model.HttpResponse(500, { "code": "InternalServerError" }));
                            } else {
                                if (user) {
                                    callback(new model.HttpResponse(409, {
                                        "code": "Conflict",
                                        "message" : "User already exists"
                                    }));
                                } else {

                                    createUser.execute(createUserDto.username, createUserDto.email, createUserDto.password, (err) => {
                                        if (err) {
                                            request.log.error(err);
                                            callback(new model.HttpResponse(500, { "code": "InternalServerError" }));
                                        } else {
                                            callback(new model.HttpResponse(201, {
                                                "email": createUserDto.email,
                                                "username": createUserDto.username,
                                                "_href": configuration.host + "/user/" + createUserDto.username
                                            }));
                                        }
                                    });
                                }
                            }
                        });
                    }, (err) => {
                        callback(new model.HttpResponse(400, {
                            "code": "BadRequest",
                            "message": err
                        }));
                    });
                }, (error) => {
                    callback(new model.HttpResponse(401, { "code" : "Unauthorized", "message" : error }));
                }, (reject) => {
                    callback(new model.HttpResponse(403, { "code" : "Forbidden", "message" : reject }));
                });
            }
        }

        public put(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {

            var updateUser = this.updateUser;
            var getUser = this.getUser;

            if (request.parameters.target) {
                this.authenticateUser.authenticate(false,
                    request.authorization,
                    request.parameters.target,
                    (user) => {

                        validate.ValidateUpdateUserDto(request.body, (dto) => {
                            getUser.execute(request.parameters.target, (err, user) => {
                                if (err) {
                                    request.log.error(err);
                                    callback(new model.HttpResponse(500, { "code": "InternalServerError" }));
                                } else {
                                    updateUser.execute(user.id, dto.email, dto.password, (err) => {
                                        if (err) {
                                            request.log.error(err);
                                            callback(new model.HttpResponse(500, { "code": "InternalServerError" }));
                                        } else {
                                            callback(new model.HttpResponse(200, { "email": dto.email }));
                                        }
                                    });
                                }
                            });
                        }, (error) => {
                            callback(new model.HttpResponse(400, { "code":"BadRequest", "message":error }));
                        });
                    }, (error) => {
                        callback(new model.HttpResponse(401, { "code": "Unauthorized", "message": error }));
                    }, (reject) => {
                        callback(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": reject }));
                    });
            } else
                callback(new model.HttpResponse(405, {
                    "code": "MethodNotAllowed",
                    "message": "Missing Url Arguments"
                }));
        }
        public del(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {
            var getUser = this.getUser;
            var deleteUser = this.deleteUser;
            var deleteProjects = this.deleteProjects;

            if (request.parameters.target) {
                this.authenticateUser.authenticate(false, request.authorization, request.parameters.target,
                    (user) => {
                        validate.ValidateUsername(request.parameters.target, () => {
                            getUser.execute(request.parameters.target, (err, user) => {
                                if (user)
                                    deleteProjects.run(user.id).then(() => {
                                        deleteUser.execute(user.username, (err) => {
                                            if (err) {
                                                request.log.error(err);
                                                callback(new model.HttpResponse(500, {"code": "InternalServerError"}));
                                            }
                                            else
                                                callback(new model.HttpResponse(204, { }));
                                        });
                                    }, (err) => {
                                            request.log.error(err);
                                            callback(new model.HttpResponse(500, { "code": "InternalServerError" }));
                                        });
                                else
                                    callback(new model.HttpResponse(404, { }));
                            });
                        }, (err) => {
                            callback(new model.HttpResponse(400, { "code": "BadRequest", "message": err }));
                        });
                    }, (error) => {
                        callback(new model.HttpResponse(401, { "code": "Unauthorized", "message": error }));
                    }, (reject) => {
                        callback(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": reject }));
                    });
            } else
                callback(new model.HttpResponse(405, {
                    "code":"MethodNotAllowed",
                    "message" : "Missing Url Arguments"
                }));
        }

        public get(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {

            q.fcall(() => {
                if (!request.parameters.target)
                    return (new model.HttpResponse(405, { "code": "MethodNotAllowed",
                        "message": "Missing Url Arguments"
                    }));

                return this.authenticateUserAndRespond.atLeastIsUser(request.authorization, request.parameters.target,
                    (loginUser:service.LogInResult) => {
                        var validation = validate._ValidateUsername(request.parameters.target);
                        if (validation.success)
                            return this.getUser.run(request.parameters.target)
                                .then((user) => {
                                    if (user)
                                        return new model.HttpResponse(200, { "email": user.email });
                                    else
                                        return new model.HttpResponse(404, {
                                            "code": "ResourceNotFound",
                                            "message": "User not found"
                                        });
                                }, (err) => {
                                    request.log.error(err);
                                    return new model.HttpResponse(500, { "code": "InternalServerError" });
                                });
                        else
                            return new model.HttpResponse(400, { "code": "BadRequest", "message": validation.reason });
                    });
            }).then(callback);
        }
    }
}
