module service {
    export interface CreateProjectService {
        forUser(user:model.LoggedInUserDetails, createProject:model.net.CreateProjectDto):Q.IPromise<model.db.Project>
    }

    export interface GetProjectService {
        byName(name:string):Q.IPromise<model.db.Project>
    }

    export interface UpdateProjectService {
        byName(name:string, dto:model.net.UpdateProjectDto):Q.IPromise<model.db.Project>
    }

    export interface DeleteProjectService {
        byName(name:string):Q.IPromise<void>
        forUser(userId:string):Q.IPromise<void>
    }
}
