/// <reference path="../data/AuthenticateUser.ts" />
/// <reference path="../model/LoggedInUser.ts" />

var Q = require('q');

module service
{
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

    export class AuthenticateUserAsTarget
    {
        private authenticateUser : data.AuthenticateUser;

        constructor(authenticateUser : data.AuthenticateUser) {
            this.authenticateUser = authenticateUser;
        }

        run(requireSuper : boolean, authorization, targetUsername : string) {
            var authenticateUser = this.authenticateUser;

            var result = authenticateUser.authenticateGodUser(authorization);
            if (result.success) {
                return Q(new LogInResult(LogInResultType.Success, undefined, new model.LoggedInUserDetails(result.username, true, result.userid)));
            } else {
                return authenticateUser.authenticateStandardUser(authorization)
                    .then((result : data.AuthenticationResult) => {
                        if (result.success) {
                            if (requireSuper)
                                return new LogInResult(LogInResultType.Rejection, "Do not possess required permission level", undefined);
                           if (!targetUsername || targetUsername == result.username)
                                return new LogInResult(LogInResultType.Success, undefined, new model.LoggedInUserDetails(result.username, false, result.userid));
                           return new LogInResult(LogInResultType.Rejection, "Resource Not Found", undefined);
                        }
                        return new LogInResult(LogInResultType.Failure, result.reason, undefined);
                    });
            }
        }
    }
}
