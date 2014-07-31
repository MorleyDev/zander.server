/// <reference path='../model/LoggedInUser.ts'/>
/// <reference path='../data/BasicAuthenticateUser.ts'/>
/// <reference path='../../typings/Q/Q.d.ts'/>

var Q = require('q');

module service {
    export enum LogInResultType {
        Success,
        Failure,
        Rejection
    }

    export class LogInResult {
        constructor(type : LogInResultType, reason : string, user : model.LoggedInUserDetails) {
            this.type = type;
            this.reason = reason;
            this.user = user;
        }

        type : LogInResultType;
        reason : string;
        user : model.LoggedInUserDetails;
    }

    export class AuthenticationService {
        private authenticateUser : data.BasicAuthenticateUser;

        constructor(authenticateUser : data.BasicAuthenticateUser) {
            this.authenticateUser = authenticateUser;
        }

        public atLeastUser(authorization, onSuccess : (result : model.LoggedInUserDetails) => Q.IPromise<model.HttpResponse>) : Q.IPromise<model.HttpResponse> {
            return this
                .requireAtLeastUser(authorization)
                .then((result:service.LogInResult) => { return AuthenticationService.LogInResultToHttpStatusCode(result, onSuccess); });
        }

        public atLeastSuper(authorization, onSuccess : (result : model.LoggedInUserDetails) => Q.IPromise<model.HttpResponse>) : Q.IPromise<model.HttpResponse> {
            return this
                .requireSuper(authorization)
                .then((result:service.LogInResult) => { return AuthenticationService.LogInResultToHttpStatusCode(result, onSuccess); });
        }

        private requireAtLeastUser(authorization) : Q.IPromise<LogInResult> {
            var authenticateUser = this.authenticateUser;

            return authenticateUser.authenticateGodUser(authorization).then((result) => {
                if (result.success)
                    return Q(new LogInResult(LogInResultType.Success, undefined, new model.LoggedInUserDetails(result.username, true, result.userid)));

                return authenticateUser.authenticateStandardUser(authorization)
                    .then((result:data.AuthenticationResult) => {
                        if (result.success)
                            return new LogInResult(LogInResultType.Success, undefined, new model.LoggedInUserDetails(result.username, false, result.userid));
                        return new LogInResult(LogInResultType.Failure, result.reason, undefined);
                    });
            });
        }

        private requireSuper(authorization) : Q.IPromise<LogInResult> {
            var authenticateUser = this.authenticateUser;

            return authenticateUser.authenticateGodUser(authorization).then((result) => {
                if (result.success)
                    return Q(new LogInResult(LogInResultType.Success, undefined, new model.LoggedInUserDetails(result.username, true, result.userid)));

                return authenticateUser.authenticateStandardUser(authorization)
                    .then((result:data.AuthenticationResult) => {
                        if (result.success)
                            return new LogInResult(LogInResultType.Rejection, "Do not possess required permission level", undefined);
                        return new LogInResult(LogInResultType.Failure, result.reason, undefined);
                    });
            });
        }

        private static LogInResultToHttpStatusCode(result : service.LogInResult, onSuccess : (result : model.LoggedInUserDetails) => Q.IPromise<model.HttpResponse>) {
            switch (result.type) {
                case service.LogInResultType.Success:
                    return onSuccess(result.user);

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
