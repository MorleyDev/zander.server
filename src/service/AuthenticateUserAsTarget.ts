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

        authenticate(authorization, getTarget, success, fail) {
            try {
                this.authenticateUser.authenticateGodUser(authorization);
                success(new model.LoggedInUserDetails(authorization.username, true));
            } catch(e) {
                fail(e);
            }
        }
    }
}
