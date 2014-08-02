module data {
    export interface ProjectRepository {
        createProject(userId:string, project:string, git:string):Q.IPromise<model.db.Project>;
        getProject(name:string):Q.IPromise<model.db.Project>;
        updateProject(name:string, git:string):Q.IPromise<void>;
        deleteProject(name:string):Q.IPromise<void>;
        deleteUsersProjects(userid:string):Q.IPromise<void>;
    }
}
