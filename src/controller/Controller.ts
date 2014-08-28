module controller {
    export interface GetController {
        getAuthLevel : model.AuthenticationLevel;
        get(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
    export interface PutController {
        putAuthLevel : model.AuthenticationLevel;
        put(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
    export interface PostController {
        postAuthLevel : model.AuthenticationLevel;
        post(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
    export interface DeleteController {
        delAuthLevel : model.AuthenticationLevel;
        del(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
}
