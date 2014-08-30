module controller.impl {
    var Q = require('q');

    export class UserCollectionControllerImpl implements UserCollectionController {
        private host:string;
        private createUserService:service.CreateUserService;

        constructor(host:string, createUserService:service.CreateUserService) {
            this.host = host;
            this.createUserService = createUserService;
        }

        public postAuthLevel = model.AuthenticationLevel.Super;
        public postValidator = "CreateUserDto";
        public postAuthoriser: string = null;

        public post(request:model.HttpRequest):Q.IPromise<model.HttpResponse> {
            return this.createUserService.fromDto(request.body).then((user) => {
                if (!user)
                    return Q(new model.HttpResponse(409, {
                        "code": "Conflict",
                        "message": "User already exists"
                    }));

                return new model.HttpResponse(201, {
                    "email": user.email,
                    "username": user.username,
                    "_href": this.host + "/user/" + user.username
                });
            });
        }
    }
}
