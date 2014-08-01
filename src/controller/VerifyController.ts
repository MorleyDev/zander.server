/// <reference path="../model/HttpResponse.ts" />
/// <reference path="../model/HttpRequest.ts" />
/// <reference path="../../typings/Q/Q.d.ts" />

module controller {
    var Q = require('q');

    export class VerifyController {
        public get(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return Q(new model.HttpResponse(200, null));
        }
    }
}
