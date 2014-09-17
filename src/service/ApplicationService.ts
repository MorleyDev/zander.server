module service {
    export interface ApplicationService {
        getVersion() : Q.IPromise<string>;
    }
}
