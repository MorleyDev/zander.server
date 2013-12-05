/// <reference path="../model/HttpResponse.ts" />
/// <reference path="../model/HttpRequest.ts" />

module controller {

    export class VerifyController {
        public get(request : model.HttpRequest) : model.HttpResponse {
            return new model.HttpResponse(200, null);
        }
    }

}
