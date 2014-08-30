module controller {
    export interface GetController {
        getAuthLevel : model.AuthenticationLevel;
        getValidator : validate.Validator;
        get(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
    export interface PutController {
        putAuthLevel : model.AuthenticationLevel;
        putValidator : validate.Validator;
        put(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
    export interface PostController {
        postAuthLevel : model.AuthenticationLevel;
        postValidator : validate.Validator;
        post(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
    export interface DeleteController {
        delAuthLevel : model.AuthenticationLevel;
        delValidator : validate.Validator;
        del(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
}
