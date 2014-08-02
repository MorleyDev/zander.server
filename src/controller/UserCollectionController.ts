module controller {
    export interface UserCollectionController {
        postAuthLevel: model.AuthenticationLevel;
        post(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
}
