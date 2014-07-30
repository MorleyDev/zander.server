/// <reference path="../../../typings/uuid/UUID.d.ts" />

var uuid = require("uuid");

module data.project {
    export class CreateProjectInDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        public run(userId:string, project:string, git:string) : any {
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

        public run(name : string) : any {
            return this._database.selectOne("Projects", { name: name });
        }
    }

    export class DeleteProjectFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        public run(name) : any {
            return this._database.delete("Projects", { name: name });
        }
    }

    export class DeleteUsersProjectsFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        public run(userid : string) : any {
            return this._database.delete("Projects", { userid: userid });
        }
    }

    export class UpdateProjectInDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        public run(name : string, git : string) {
            return this._database.update("Projects", { git: git }, { name: name });
        }
    }
}
