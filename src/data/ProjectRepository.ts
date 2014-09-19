module data {
    export interface ProjectRepository {
        createProject(userId:string, project:string, git:string): Q.IPromise<model.db.Project>;
        
        getProjectCount(): Q.IPromise<number>;
        
        getProjectCountFilterByName(nameFilter: string): Q.IPromise<number>;
        
        getProject(name:string): Q.IPromise<model.db.Project>;
        
        getProjectCollection(start: number, count: number): Q.IPromise<model.db.Project[]>;
        
        getProjectCollectionFilterByName(nameFilter: string, start: number, count: number): Q.IPromise<model.db.Project[]>;
        
        updateProject(name:string, git:string): Q.IPromise<void>;
        
        deleteProject(name:string): Q.IPromise<void>;
        
        deleteUsersProjects(userid:string): Q.IPromise<void>;
    }
}
