/// <reference path='../model/LoggedInUser.ts'/>
/// <reference path='../data/BasicAuthenticateUser.ts'/>
/// <reference path='../../typings/Q/Q.d.ts'/>


module service {
    var Q = require('q');

    export enum LogInResultType {
        Success,
        Failure,
        Rejection
    }

    export class LogInResult {
        constructor(type:LogInResultType, reason:string, user:model.LoggedInUserDetails) {
            this.type = type;
            this.reason = reason;
            this.user = user;
        }

        public type:LogInResultType;
        public reason:string;
        public user:model.LoggedInUserDetails;
    }

    export class AuthenticationService {
        private authenticateUser:data.BasicAuthenticateUser;

        constructor(authenticateUser:data.BasicAuthenticateUser) {
            this.authenticateUser = authenticateUser;
        }

        public atLeast(minAuthLevel:model.AuthenticationLevel, request:model.HttpRequest, onSuccess:(result:model.HttpRequest) => Q.IPromise<model.HttpResponse>):Q.IPromise<model.HttpResponse> {
            return this
                .requireAtLeast(minAuthLevel, request.authorization)
                .then(AuthenticationService.handleLogInResult(request, onSuccess));
        }

        private requireAtLeast(minAuthLevel:model.AuthenticationLevel, authorization:any):Q.IPromise<LogInResult> {

            if (minAuthLevel < model.AuthenticationLevel.User)
                return Q(new LogInResult(LogInResultType.Success, undefined, undefined));

            return this.authenticateUser
                .authenticateGodUser(authorization)
                .then((result:data.AuthenticationResult) => {
                    if (result.success)
                        return Q(new LogInResult(LogInResultType.Success, undefined, new model.LoggedInUserDetails(result.username, model.AuthenticationLevel.Super, result.userid)));

                    return this.authenticateUser.authenticateStandardUser(authorization)
                        .then((result:data.AuthenticationResult):Q.IPromise<LogInResult> => {
                            if (result.success) {
                                if (minAuthLevel > model.AuthenticationLevel.User)
                                    return Q(new LogInResult(LogInResultType.Rejection, "Do not possess required permission level", undefined));

                                return Q(new LogInResult(LogInResultType.Success, undefined, new model.LoggedInUserDetails(result.username, model.AuthenticationLevel.User, result.userid)));
                            }
                            return Q(new LogInResult(LogInResultType.Failure, result.reason, undefined));
                        });
                });
        }

        private static handleLogInResult(request:model.HttpRequest, onSuccess:(request:model.HttpRequest) => Q.IPromise<model.HttpResponse>):(result:service.LogInResult) => Q.IPromise<model.HttpResponse> {
            return function (result:service.LogInResult):Q.IPromise<model.HttpResponse> {
                switch (result.type) {
                    case service.LogInResultType.Success:
                        request.user = result.user;
                        return onSuccess(request);

                    case service.LogInResultType.Rejection:
                        return Q(new model.HttpResponse(403, { "code": "Forbidden", "message": result.reason }));

                    case service.LogInResultType.Failure:
                        return Q(new model.HttpResponse(401, { "code": "Unauthorized", "message": result.reason }));

                    default:
                        return Q(new model.HttpResponse(500, { "code": "InternalServerError" }));
                }
            }
        }
    }
}
