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
            return this._database.query("SELECT COUNT(*) FROM Projects")
                       .get(0)
                       .get("COUNT(*)");
        }

        public getProject(name:string):Q.IPromise<model.db.Project> {
            return this._database.selectOne("Projects", { name: name });
        }
        
        public getProjectCollection(start: number, count: number) {
            return this._database.query("SELECT name FROM Projects ORDER BY name LIMIT ?,?", [start,count])
                       .invoke('map', (row) => { return row["name"]; });
        }
        
        public getProjectCountFilterByName(nameFilter: string) : Q.IPromise<number> {
            return this._database.query("SELECT COUNT(*) FROM Projects WHERE name LIKE ?", ['%'+nameFilter+'%'])
                       .get(0)
                       .get("COUNT(*)");
        }

        public getProjectCollectionFilterByName(nameFilter: string, start: number, count: number): Q.IPromise<model.db.Project[]> {
        
            return this._database.query("SELECT name FROM Projects WHERE name LIKE ? ORDER BY name LIMIT ?,?", 
                                        ['%'+nameFilter+'%', start,count]).then((rows:any[]) => {
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
