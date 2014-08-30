module service {
    export enum AuthorisationResult {
        Success,
        Failure,
        NotFound
    }

    export interface AuthorisationService {
        authenticate(details: model.UserLogin, target: string) : Q.IPromise<AuthorisationResult>;
    }
}
