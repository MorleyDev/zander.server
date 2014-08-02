module service {
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

    export interface AuthenticationService {
        atLeast(minAuthLevel:model.AuthenticationLevel, request:model.HttpRequest, onSuccess:(result:model.HttpRequest) => Q.IPromise<model.HttpResponse>):Q.IPromise<model.HttpResponse>;
    }
}
