/// <reference path="../model/HttpResponse.ts" />
/// <reference path="../model/HttpRequest.ts" />
/// <reference path="../../typings/Q/Q.d.ts" />

var Q = require('q');

module controller {
    export class VerifyController {
        public get(request:model.HttpRequest): Q.IPromise<model.HttpResponse> {
            return Q(new model.HttpResponse(200, null));
        }
    }
}
