module controller {
    export interface UserController {
        putAuthLevel : model.AuthenticationLevel;
        delAuthLevel : model.AuthenticationLevel;
        getAuthLevel : model.AuthenticationLevel;

        put(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
        del(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
        get(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
}
