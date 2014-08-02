module service.impl {
    var Q = require('q');

    export class AuthenticationServiceImpl implements AuthenticationService {
        private authenticateUser:data.AuthenticateUser;

        constructor(authenticateUser:data.AuthenticateUser) {
            this.authenticateUser = authenticateUser;
        }

        public atLeast(minAuthLevel:model.AuthenticationLevel, request:model.HttpRequest, onSuccess:(result:model.HttpRequest) => Q.IPromise<model.HttpResponse>):Q.IPromise<model.HttpResponse> {
            return this
                .requireAtLeast(minAuthLevel, request.authorization)
                .then(AuthenticationServiceImpl.handleLogInResult(request, onSuccess));
        }

        private requireAtLeast(minAuthLevel:model.AuthenticationLevel, authorization:any):Q.IPromise<LogInResult> {

            if (minAuthLevel < model.AuthenticationLevel.User)
                return Q(new LogInResult(LogInResultType.Success, undefined, undefined));

            return this.authenticateUser
                .authenticateGodUser(authorization)
                .then((result:data.AuthenticationResult) => {
                    if (result.success)
                        return Q(new LogInResult(LogInResultType.Success, undefined, new model.UserLogin(result.username, model.AuthenticationLevel.Super, result.userid)));

                    return this.authenticateUser.authenticateStandardUser(authorization)
                        .then((result:data.AuthenticationResult):Q.IPromise<LogInResult> => {
                            if (result.success) {
                                if (minAuthLevel > model.AuthenticationLevel.User)
                                    return Q(new LogInResult(LogInResultType.Rejection, "Do not possess required permission level", undefined));

                                return Q(new LogInResult(LogInResultType.Success, undefined, new model.UserLogin(result.username, model.AuthenticationLevel.User, result.userid)));
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
