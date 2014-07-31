/// <reference path='../../typings/node-uuid/node-uuid.d.ts'/>
/// <reference path='../../typings/Q/Q.d.ts'/>

var uuid : UUID = require("uuid");

module data {
    export class ProjectRepository {
        private _database;

        constructor(database) {
            this._database = database;
        }

        public createProject(userId : string, project : string, git : string) : Q.IPromise<any> {
            var projectDto = {
                id: uuid.v1(),
                userId: userId,
                name: project,
                git: git,
                timestamp: Date.now()
            };
            return this._database.insert("Projects", projectDto);
        }

        public getProject(name : string) : Q.IPromise<any> {
            return this._database.selectOne("Projects", { name: name });
        }

        public updateProject(name : string, git : string) : Q.IPromise<any> {
            return this._database.update("Projects", { git: git }, { name: name });
        }

        public deleteProject(name) : Q.IPromise<any> {
            return this._database.delete("Projects", { name: name });
        }

        public deleteUsersProjects(userid : string) : Q.IPromise<any> {
            return this._database.delete("Projects", { userid: userid });
        }
    }
}
