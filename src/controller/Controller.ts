module controller {
    export interface GetController {
        getAuthLevel : model.AuthenticationLevel;
        getValidator : string;
        getAuthoriser : string;
        get(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
    export interface PutController {
        putAuthLevel : model.AuthenticationLevel;
        putValidator : string;
        putAuthoriser : string;
        put(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
    export interface PostController {
        postAuthLevel : model.AuthenticationLevel;
        postValidator : string;
        postAuthoriser : string;
        post(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
    export interface DeleteController {
        delAuthLevel : model.AuthenticationLevel;
        delValidator : string;
        delAuthoriser : string;
        del(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
}
