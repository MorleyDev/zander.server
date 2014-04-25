/// <reference path="../model/HttpResponse.ts" />
/// <reference path="../model/HttpRequest.ts" />
/// <reference path="../model/dto/CreateUserDto.ts" />
/// <reference path="../validate/ValidateCreateUserDto.ts" />

module controller {

    export class UserController {
        public post(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {
            var createUserDto:model.dto.CreateUserDto = request.body;
            try {
                validate.ValidateCreateUserDto(createUserDto)
            } catch(e) {
                callback(new model.HttpResponse(400, { "Error" : e }));
                return;
            }
            callback(new model.HttpResponse(401, { "Error" : "Unauthorized" }));
        }
        public put(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {
            callback(new model.HttpResponse(403, null));
        }
        public del(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {
            callback(new model.HttpResponse(403, null));
        }
        public get(request : model.HttpRequest, callback : (m : model.HttpResponse) => void) {
            callback(new model.HttpResponse(403, null));
        }
    }
}
