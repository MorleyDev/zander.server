module service {
    export enum AuthorisationResult {
        Success,
        Failure,
        NotFound
    }

    export interface AuthorisationService {
        forUser(details: model.UserLogin, username: string) : Q.IPromise<AuthorisationResult>;
        forProject(details: model.UserLogin, projectname: string) : Q.IPromise<AuthorisationResult>;
    }
}
