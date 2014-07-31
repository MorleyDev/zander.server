/// <reference path='HashPassword.ts'/>
/// <reference path='UserRepository.ts'/>
/// <reference path='../model/Configuration.ts'/>

module data
{
    export class AuthenticationResult {

        constructor(success: boolean, reason: string, username: string, userid: string) {
            this.success = success;
            this.reason = reason;
            this.username = username;
            this.userid = userid;
        }

        public success: boolean;
        public reason: string;
        public username: string;
        public userid: string;
    }

    export class BasicAuthenticateUser {
        private _goduser : model.ConfigurationGodUser;
        private _hashType : string;
        private _userRepository : UserRepository;

        constructor(configuration : model.Configuration, userRepository : UserRepository) {
            this._goduser = configuration.goduser;
            this._hashType = configuration.hashAlgorithm;
            this._userRepository = userRepository;
        }

        public authenticateGodUser(authorization) : Q.IPromise<AuthenticationResult> {
            if (!this._goduser)
                return Q(new AuthenticationResult(false, "Super-user not enabled on this server", undefined, undefined));

            if (!authorization || !authorization.scheme)
                return Q(new AuthenticationResult(false, "No or Incorrect Authentication details provided", undefined, undefined));
            if (authorization.scheme !== "Basic" || !authorization.basic)
                return Q(new AuthenticationResult(false, "Unrecognised authorization scheme", undefined, undefined));

            var username = authorization.basic.username;
            var password = authorization.basic.password;
            if (username && password && username === this._goduser.name && password === this._goduser.password)
                return Q(new AuthenticationResult(true, undefined, username, "00000000-0000-0000-0000-000000000000"));

            return Q(new AuthenticationResult(false, "No or Incorrect Authentication details provided", undefined, undefined));
        }

        public authenticateStandardUser(authorization) : Q.IPromise<AuthenticationResult> {

            if (!authorization || !authorization.scheme)
                return Q(new AuthenticationResult(false, "No or Incorrect Authentication details provided", undefined, undefined));

            if (authorization.scheme !== "Basic" || !authorization.basic)
                return Q(new AuthenticationResult(false, "Unrecognised authorization scheme", undefined, undefined));

            var username = authorization.basic.username;
            var password = authorization.basic.password;
            return this._userRepository.getUser(username)
                .then((user) => {
                    if (user && user.password === HashPassword(this._hashType, user.id, password))
                            return new AuthenticationResult(true, undefined, user.username, user.id);
                    return new AuthenticationResult(false, "No or Incorrect Authentication details provided", undefined, undefined);
                });
        }
    }
}
