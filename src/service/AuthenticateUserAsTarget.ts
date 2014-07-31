/// <reference path="../data/AuthenticateUser.ts" />
/// <reference path="../model/LoggedInUser.ts" />

var Q = require('q');

module service
{

    export class AuthenticateUserAsTarget
    {
        private authenticateUser : data.AuthenticateUser;

        constructor(authenticateUser : data.AuthenticateUser) {
            this.authenticateUser = authenticateUser;
        }

    }
}
