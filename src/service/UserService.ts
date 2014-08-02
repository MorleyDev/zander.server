module service {
    export interface CreateUserService {
        fromDto(dto:model.net.CreateUserDto):Q.IPromise<model.db.User>;
    }

    export interface UpdateUserService {
        withUsername(username:string, dto:model.net.UpdateUserDto):Q.IPromise<model.db.User>;
    }

    export interface GetUserService {
        byUsername(username:string):Q.IPromise<model.db.User>;
    }

    export interface DeleteUserService {
        byUser(user:model.db.User):Q.IPromise<void>;
    }
}
