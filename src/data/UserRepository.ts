module data {
    export interface UserRepository {
        createUser(username:string, email:string, password:string):Q.IPromise<model.db.User>
        getUser(username:string):Q.IPromise<model.db.User>
        updateUser(id:string, email:string, password:string):Q.IPromise<void>
        deleteUser(username:string):Q.IPromise<void>
    }
}
