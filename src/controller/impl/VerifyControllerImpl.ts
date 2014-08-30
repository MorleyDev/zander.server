module controller.impl {
    var Q = require('q');

    export class VerifyControllerImpl implements VerifyController {

        public getAuthLevel:model.AuthenticationLevel = model.AuthenticationLevel.None;
        public getValidator:validate.Validator = null;

        public get(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return Q(new model.HttpResponse(200, null));
        }
    }
}
