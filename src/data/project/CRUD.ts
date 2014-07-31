/// <reference path="../../../typings/node-uuid/node-uuid.d.ts" />

var uuid : UUID = require("uuid");

module data.project {
    export class CreateProjectInDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        public run(userId:string, project:string, git:string) : Q.IPromise<any> {
            var projectDto = {
                id: uuid.v1(),
                userId: userId,
                name: project,
                git: git,
                timestamp: Date.now()
            };
            return this._database.insert("Projects", projectDto);
        }
    }

    export class GetProjectFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        public run(name : string) : Q.IPromise<any> {
            return this._database.selectOne("Projects", { name: name });
        }
    }

    export class DeleteProjectFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        public run(name) : Q.IPromise<any> {
            return this._database.delete("Projects", { name: name });
        }
    }

    export class DeleteUsersProjectsFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        public run(userid : string) : Q.IPromise<any> {
            return this._database.delete("Projects", { userid: userid });
        }
    }

    export class UpdateProjectInDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        public run(name : string, git : string) : Q.IPromise<any> {
            return this._database.update("Projects", { git: git }, { name: name });
        }
    }
}
