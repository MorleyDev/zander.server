/// <reference path="../data/AuthenticateUser.ts" />
/// <reference path="../model/LoggedInUser.ts" />

module service
{
    export class AuthenticateUserAsTarget
    {
        private authenticateUser : data.AuthenticateUser;

        constructor(authenticateUser : data.AuthenticateUser) {
            this.authenticateUser = authenticateUser;
        }

        authenticate(requireSuper, authorization, target, success, fail) {
            var authenticateUser = this.authenticateUser;
            authenticateUser.authenticateGodUser(authorization, function (username) {
                success(new model.LoggedInUserDetails(username, true));
            }, function (error) {
                if (requireSuper) {
                    fail(error);
                } else {
                    authenticateUser.authenticateStandardUser(authorization, function(username) {
                        if (target == username)
                            success(new model.LoggedInUserDetails(username, false));
                        else
                            fail("No or Incorrect Authentication details provided");
                    }, function(error) {
                        fail(error);
                    });
                }
            });
        }
    }
}
