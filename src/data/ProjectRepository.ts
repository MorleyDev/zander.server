/// <reference path='../../typings/node-uuid/node-uuid.d.ts'/>
/// <reference path='../../typings/Q/Q.d.ts'/>
/// <reference path='../model/db/Project.ts' />


module data {
    var uuid:UUID = require("uuid");

    export class ProjectRepository {
        private _database:any;

        constructor(database:any) {
            this._database = database;
        }

        public createProject(userId:string, project:string, git:string):Q.IPromise<model.db.Project> {
            var projectDto = {
                id: uuid.v1(),
                userId: userId,
                name: project,
                git: git,
                timestamp: Date.now()
            };
            return this._database.insert("Projects", projectDto).then((rowId:any) => {
                return projectDto;
            });
        }

        public getProject(name:string):Q.IPromise<model.db.Project> {
            return this._database.selectOne("Projects", { name: name });
        }

        public updateProject(name:string, git:string):Q.IPromise<void> {
            return this._database.update("Projects", { git: git }, { name: name });
        }

        public deleteProject(name:string):Q.IPromise<void> {
            return this._database.delete("Projects", { name: name });
        }

        public deleteUsersProjects(userid:string):Q.IPromise<void> {
            return this._database.delete("Projects", { userid: userid });
        }
    }
}
