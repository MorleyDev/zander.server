module data.impl {
    var uuid:UUID = require("uuid");

    export class ProjectRepositoryImpl implements ProjectRepository {
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

        public getProjectCount() : Q.IPromise<number> {
            return this._database.query("SELECT COUNT(*) FROM Projects").then((result: any) => {
                return result[0]["COUNT(*)"];
            });
        }

        public getProject(name:string):Q.IPromise<model.db.Project> {
            return this._database.selectOne("Projects", { name: name });
        }
        
        public getProjectCollection(start: number, count: number) {
            return this._database.select("Projects").then((rows:any[]) => {
                return rows.map((row) => { return row["name"]; });
            });
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
