var uuid = require("uuid");

module data.project {
    export class CreateProjectInDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        execute(userId:string, project:string, git:string, callback) {
            try {
                var projectDto = {
                    id: uuid.v1(),
                    userId: userId,
                    name: project,
                    git: git,
                    timestamp: Date.now()
                };
                this._database.insert("Projects", projectDto, function (err, insertId) {
                    callback(err);
                });
            } catch (e) {
                callback(e);
            }
        }
    }

    export class GetProjectFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        execute(name, callback) {
            this._database.select("Projects", { name: name }, function (err, row) {
                if (err) {
                    callback(null, err);
                } else {
                    if (row && row.length > 0)
                        callback(row[0], null);
                    else
                        callback(null, null);
                }
            });
        }
    }

    export class DeleteProjectFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        execute(name, callback) {
            this._database.delete("Projects", { name: name }, callback);
        }
    }

    export class UpdateProjectInDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        execute(name, git, callback) {
            this._database.update("Projects", { git: git }, { name: name }, callback);
        }
    }
}
