/// <reference path="../model/HttpResponse.ts" />
/// <reference path="../model/HttpRequest.ts" />
/// <reference path="../model/dto/CreateUserDto.ts" />
/// <reference path="../validate/ValidateCreateUserDto.ts" />
/// <reference path="../service/AuthenticateUserAsTarget.ts" />

module controller {

    export class UserController {

        private static authenticateUser : service.AuthenticateUserAsTarget;

        constructor(authenticateUser : service.AuthenticateUserAsTarget) {
            UserController.authenticateUser = authenticateUser;
        }

        public post(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {

            if (request.parameters.target) {
                callback(new model.HttpResponse(405, {
                    "code": "MethodNotAllowed",
                    "message": "POST not supported on user"
                }));
            } else {
                UserController.authenticateUser.authenticate(request.authorization, null, function(user) {
                    var createUserDto:model.dto.CreateUserDto = request.body;
                    try {
                        validate.ValidateCreateUserDto(createUserDto);
                        callback(new model.HttpResponse(302, { }));
                    } catch (e) {
                        callback(new model.HttpResponse(400, {
                            "code": "BadRequest",
                            "message": e
                        }));
                    }
                }, function(error) {
                    callback(new model.HttpResponse(401, { "code" : "Unauthorized", "message" : error }));
                });
            }
        }

        public put(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {

            if (request.parameters.target) {
                UserController.authenticateUser.authenticate(request.authorization, null, function(user) {
                    callback(new model.HttpResponse(302, { }));
                }, function(error) {
                    callback(new model.HttpResponse(401, { "code" : "Unauthorized", "message" : error }));
                });
            } else
                callback(new model.HttpResponse(405, {
                    "code":"MethodNotAllowed",
                    "message" : "Missing Url Arguments"
                }));
        }
        public del(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {
            if (request.parameters.target) {
                UserController.authenticateUser.authenticate(request.authorization, null, function(user) {
                    callback(new model.HttpResponse(404, { }));
                }, function(error) {
                    callback(new model.HttpResponse(401, { "code" : "Unauthorized", "message" : error }));
                });
            } else
                callback(new model.HttpResponse(405, {
                    "code":"MethodNotAllowed",
                    "message" : "Missing Url Arguments"
                }));
        }

        public get(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {
            if (request.parameters.target) {
                UserController.authenticateUser.authenticate(request.authorization, null, function(user) {
                    callback(new model.HttpResponse(404, { }));
                }, function(error) {
                    callback(new model.HttpResponse(401, { "code" : "Unauthorized", "message" : error }));
                });
            } else
                callback(new model.HttpResponse(405, { "code":"MethodNotAllowed",
                    "message" : "Missing Url Arguments"
                }));
        }
    }
}
