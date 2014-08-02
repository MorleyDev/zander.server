module controller {
    export interface ProjectCollectionController {
        postAuthLevel : model.AuthenticationLevel;
        post(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
}
