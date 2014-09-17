module data {
    export interface ApplicationRepository {
        version() : Q.IPromise<string>;
    }
}
