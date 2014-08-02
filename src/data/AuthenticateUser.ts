module data {
    export class AuthenticationResult {
        constructor(success:boolean, reason:string, username:string, userid:string) {
            this.success = success;
            this.reason = reason;
            this.username = username;
            this.userid = userid;
        }

        public success:boolean;
        public reason:string;
        public username:string;
        public userid:string;
    }

    export interface AuthenticateUser {
        authenticateGodUser(authorization:any):Q.IPromise<AuthenticationResult>;
        authenticateStandardUser(authorization:any):Q.IPromise<AuthenticationResult>;
    }
}
