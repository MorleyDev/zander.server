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

        authenticate(requireSuper, authorization, target, success, fail, reject) {

            var authenticateUser = this.authenticateUser;
            authenticateUser.authenticateGodUser(authorization, function (username) {
                success(new model.LoggedInUserDetails(username, true, "00000000-0000-0000-0000-000000000000"));
            }, function (error) {
                authenticateUser.authenticateStandardUser(authorization, function (username, userid) {
                    if ( requireSuper )
                        reject("Do not possess required permission level");
                    else if (!target || target == username)
                        success(new model.LoggedInUserDetails(username, false, userid));
                    else
                        reject("Resource Not Found");
                }, function (error) {
                    fail(error);
                });
            });
        }
    }
}
