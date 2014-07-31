/// <reference path="../data/AuthenticateUser.ts" />
/// <reference path="../model/LoggedInUser.ts" />
/// <reference path="../model/HttpResponse.ts" />
/// <reference path="AuthenticateUserAsTarget.ts" />
/// <reference path="../../typings/Q/Q.d.ts" />

module service {
    export class AuthenticateUserAndRespond {
        private authenticationService : AuthenticateUserAsTarget;

        constructor(authenticationService : AuthenticateUserAsTarget) {
            this.authenticationService = authenticationService;
        }

        private _authenticate(requireSuper : boolean, authorization, target, onSuccess : (result : LogInResult) => Q.IPromise<model.HttpResponse>) : Q.IPromise<model.HttpResponse> {
            return this.authenticationService.run(requireSuper, authorization, target)
                .then((result:service.LogInResult) => {
                    switch (result.type) {
                        case service.LogInResultType.Success:
                            return onSuccess(result);

                        case service.LogInResultType.Rejection:
                            return new model.HttpResponse(403, { "code": "Forbidden", "message": result.reason });

                        case service.LogInResultType.Failure:
                            return new model.HttpResponse(401, { "code": "Unauthorized", "message": result.reason });

                        default:
                            return new model.HttpResponse(500, { "code": "InternalServerError" });

                    }
                });
        }

        private _authenticateOnHidden(requireSuper : boolean, authorization, target, onSuccess : (result : LogInResult) => Q.IPromise<model.HttpResponse>) : Q.IPromise<model.HttpResponse> {
            return this.authenticationService.run(requireSuper, authorization, target)
                .then((result:service.LogInResult) => {
                    switch (result.type) {
                        case service.LogInResultType.Success:
                            return onSuccess(result);

                        case service.LogInResultType.Rejection:
                            return new model.HttpResponse(404, { "code": "ResourceNotFound", "message": result.reason });

                        case service.LogInResultType.Failure:
                            return new model.HttpResponse(401, { "code": "Unauthorized", "message": result.reason });

                        default:
                            return new model.HttpResponse(500, { "code": "InternalServerError" });

                    }
                });
        }
        public atLeastUser(authorization, onSuccess : (result : LogInResult) => Q.IPromise<model.HttpResponse>) : Q.IPromise<model.HttpResponse> {
            return this._authenticate(false, authorization, null, onSuccess);
        }

        public atLeastSuper(authorization, onSuccess : (result : LogInResult) => Q.IPromise<model.HttpResponse>) : Q.IPromise<model.HttpResponse> {
            return this._authenticate(true, authorization, null, onSuccess);
        }

        public atLeastIsUser(authorization, targetUsername, onSuccess : (result : LogInResult) => Q.IPromise<model.HttpResponse>) : Q.IPromise<model.HttpResponse> {
            return this._authenticateOnHidden(false, authorization, targetUsername, onSuccess);
        }
    }
}
