/// <reference path="../model/HttpResponse.ts" />
/// <reference path="../model/HttpRequest.ts" />
/// <reference path="../model/dto/CreateUserDto.ts" />
/// <reference path="../validate/ValidateUserDto.ts" />
/// <reference path="../service/AuthenticateUserAsTarget.ts" />
/// <reference path="../data/user/CRUD.ts" />

module controller {

    export class UserController {

        private configuration;
        private authenticateUser : service.AuthenticateUserAsTarget;
        private createUser : data.user.CreateUserInDatabase;
        private getUser : data.user.GetUserFromDatabase;
        private deleteUser : data.user.DeleteUserFromDatabase;
        private updateUser : data.user.UpdateUserInDatabase;

        constructor(configuration,
                    authenticateUser : service.AuthenticateUserAsTarget,
                    createUser : data.user.CreateUserInDatabase,
                    getUser : data.user.GetUserFromDatabase,
                    deleteUser : data.user.DeleteUserFromDatabase,
                    updateUser : data.user.UpdateUserInDatabase) {
            this.configuration = configuration;
            this.authenticateUser = authenticateUser;
            this.createUser = createUser;
            this.getUser = getUser;
            this.deleteUser = deleteUser;
            this.updateUser = updateUser;
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
                this.authenticateUser.authenticate(true, request.authorization, null, function(user) {

                    var createUserDto:model.dto.CreateUserDto = request.body;
                    validate.ValidateCreateUserDto(createUserDto, function (dto:model.dto.CreateUserDto) {

                        getUser.execute(dto.username, function (user, err) {
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
                                    createUser.execute(dto.username, dto.email, dto.password, function (err) {
                                        if (err) {
                                            request.log.error(err);
                                            callback(new model.HttpResponse(500, { "code": "InternalServerError" }));
                                        } else {
                                            callback(new model.HttpResponse(201, {
                                                "email": dto.email,
                                                "username": dto.username,
                                                "_href": configuration.host + "/user/" + dto.username
                                            }));
                                        }
                                    });
                                }
                            }
                        });
                    }, function (err) {
                        callback(new model.HttpResponse(400, {
                            "code": "BadRequest",
                            "message": err
                        }));
                    });
                }, function(error) {
                    callback(new model.HttpResponse(401, { "code" : "Unauthorized", "message" : error }));
                }, function (reject) {
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
                    function (user) {
                        validate.ValidateUpdateUserDto(request.body, function(dto) {
                            getUser.execute(request.parameters.target, function(user, err) {
                                if (err) {
                                    request.log.error(err);
                                    callback(new model.HttpResponse(500, { "code": "InternalServerError" }));
                                } else {
                                    updateUser.execute(user.id, dto.email, dto.password, function(err) {
                                        if (err) {
                                            request.log.error(err);
                                            callback(new model.HttpResponse(500, { "code": "InternalServerError" }));
                                        } else {
                                            callback(new model.HttpResponse(200, { "email": dto.email }));
                                        }
                                    });
                                }
                            });
                        }, function(error) {
                            callback(new model.HttpResponse(400, { "code":"BadRequest", "message":error }));
                        });
                    }, function (error) {
                        callback(new model.HttpResponse(401, { "code": "Unauthorized", "message": error }));
                    }, function (reject) {
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
            if (request.parameters.target) {
                this.authenticateUser.authenticate(false, request.authorization, request.parameters.target,
                    function(user) {
                        validate.ValidateUsername(request.parameters.target, function (target) {
                            getUser.execute(target, function (user, err) {
                                if (user)
                                    deleteUser.execute(user.username, function(err) {
                                      if (err) {
                                          request.log.error(err);
                                          callback(new model.HttpResponse(500, {"code": "InternalServerError"}));
                                      }
                                      else
                                        callback(new model.HttpResponse(204, { }));
                                    });

                                else
                                    callback(new model.HttpResponse(404, { }));
                            });
                        }, function (err) {
                            callback(new model.HttpResponse(400, { "code": "BadRequest", "message": err }));
                        });
                    }, function(error) {
                        callback(new model.HttpResponse(401, { "code": "Unauthorized", "message": error }));
                    }, function (reject) {
                        callback(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": reject }));
                    });
            } else
                callback(new model.HttpResponse(405, {
                    "code":"MethodNotAllowed",
                    "message" : "Missing Url Arguments"
                }));
        }

        public get(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {

            var getUser = this.getUser;

            if (request.parameters.target) {

                this.authenticateUser.authenticate(false,
                    request.authorization,
                    request.parameters.target,
                    function(user) {
                        validate.ValidateUsername(request.parameters.target, function (target) {
                            getUser.execute(target, function (user, err) {
                                if (err) {
                                    request.log.error(err);
                                    callback(new model.HttpResponse(500, { "code": "InternalServerError" }));
                                } else if (user)
                                    callback(new model.HttpResponse(200, { "email": user.email }));
                                else
                                    callback(new model.HttpResponse(404, {
                                        "code" : "ResourceNotFound",
                                        "message" : "User not found"
                                    }));
                            });
                        }, function (err) {
                            callback(new model.HttpResponse(400, { "code": "BadRequest", "message": err }));
                        });
                    }, function(error) {
                        callback(new model.HttpResponse(401, { "code": "Unauthorized", "message": error }));
                    }, function (reject) {
                        callback(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": reject }));
                    });
            } else
                callback(new model.HttpResponse(405, { "code":"MethodNotAllowed",
                    "message" : "Missing Url Arguments"
                }));
        }
    }
}
