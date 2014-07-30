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

        public execute(userId:string, project:string, git:string, callback) {
            this.run(userId, project, git)
                .then(function (id) {
                    callback(undefined);
                }, function(err) {
                    callback(err);
                });
        }
    }

    export class GetProjectFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        public run(name) : any {
            return this._database.selectOne("Projects", { name: name });
        }

        public execute(name, callback) {
            this.run(name)
                .then((row) => {
                callback(null, row);
            },
            (err) => {
                callback(err, null);
            });
        }
    }

    export class DeleteProjectFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        public execute(name, callback) {
            this.run(name)
                .then(function () {
                    callback(undefined);
                }, function(err) {
                    callback(err);
                });
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

        public execute(userid, callback) {
            this.run(userid)
                .then(() => {
                callback(undefined);
            }, (err) => {
                callback(err);
            });
        }

        public run(userid) : any {
            return this._database.delete("Projects", { userid: userid });
        }
    }

    export class UpdateProjectInDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        public execute(name, git, callback) {
            this.run(name,git)
                .then(function() {
                    callback(undefined);
                }, function(err) {
                    callback(err);
                });
        }

        public run(name, git) {
            return this._database.update("Projects", { git: git }, { name: name });
        }
    }
}
