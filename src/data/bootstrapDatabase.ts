enum DatabaseType {
    SqlLite,
    MySQL
}

function bootstrap_database(type:DatabaseType, config:model.Configuration, finalCallback:(err:any, database:any) => void) {

    var tableName_zanderDetails = "ZanderDetails";
    var tableName_users = "Users";
    var tableName_projects = "Projects";

    var nodeSql:any = require('nodesql');

    var builderStack:any = [];
    builderStack[0] = function (db:any, callback:(err:any) => void) {
        db.query("CREATE TABLE " + tableName_zanderDetails + " (id INT NOT NULL, version INT NOT NULL)", function (err:any) {
            console.log("Created version table");
            if (err) {
                callback(err);
                return;
            }

            db.insert(tableName_zanderDetails, { id: 0, version: -1 }, function (err:any) {
                callback(err)
            });
        })
    };
    builderStack[1] = function (db:any, callback:(err:any) => void) {
        db.query("CREATE TABLE " + tableName_users + " (id VARCHAR(36) NOT NULL, " +
            "username VARCHAR(20) NOT NULL, " +
            "email VARCHAR(30) NOT NULL, " +
            "password CHAR(128) NOT NULL, " +
            "timestamp INTEGER NOT NULL)", function (err:any) {
            console.log("Created user table");
            callback(err);
        })
    };
    builderStack[2] = function (db:any, callback:(err:any) => void) {
        db.query("CREATE TABLE " + tableName_projects + " (id VARCHAR(36) NOT NULL, " +
            "userId VARCHAR(36) NOT NULL, " +
            "name VARCHAR(20) NOT NULL, " +
            "git VARCHAR(50) NOT NULL, " +
            "timestamp INTEGER NOT NULL)", function (err:any) {
            console.log("Created project table");
            callback(err);
        })
    };

    function bootstrap(currentVersion:number, db:any, callback:(err:any) => void) {
        var upperVersion = builderStack.length - 1;
        var nextVersion = currentVersion + 1;

        if (currentVersion > upperVersion) {
            callback("Unknown version installed")
        } else if (currentVersion === upperVersion) {
            console.log("Current Version Installed");
            callback(null)
        } else {
            console.log("Update from " + currentVersion + " to " + nextVersion);
            builderStack[nextVersion](db, function (err:any) {
                console.log("Updated from " + currentVersion + " to " + nextVersion);
                if (err)
                    callback(err);
                else
                    db.update(tableName_zanderDetails, { version: nextVersion }, {id: 0}, function (err:any) {
                        console.log("ZanderDetails version updated to " + nextVersion);
                        if (err)
                            callback(err);
                        else
                            bootstrap(nextVersion, db, callback);
                    });
            })
        }
    }

    function bootstrap_with_connection(db:any, callback:(err:any) => void) {
        db.select(tableName_zanderDetails, function (err:any, value:any) {
            if (err || !value || value.length < 1) {
                bootstrap(-1, db, callback);
            }
            else
                bootstrap(value[0].version, db, callback);
        })
    }

    switch (type) {
        case DatabaseType.SqlLite:
            var sqlite3:any = require('sqlite3').verbose();
            var databaseString = config.sqlite || ':memory:';
            console.log("Sqlite connection: " + databaseString);

            var connection = new sqlite3.Database(databaseString,
                function () {
                    var db = nodeSql.createSqliteStrategy(connection);
                    bootstrap_with_connection(db, function (err:any) {
                        finalCallback(err, db);
                    });
                });
            break;

        case DatabaseType.MySQL:
            var mysql:any = require('mysql');
            var connection = mysql.createConnection(config.mysql);
            var db = nodeSql.createMySqlStrategy(connection);
            bootstrap_with_connection(db, function (err:any) {
                finalCallback(err, db);
            });
            break;

        default:
            finalCallback("Unrecognised database type", null);
    }
}

function bootstrap_with_config(config:model.Configuration, callback:(err:any, db:any) => void) {
    if (config.mysql)
        bootstrap_database(DatabaseType.MySQL, config, callback);
    else {
        bootstrap_database(DatabaseType.SqlLite, config, callback);
    }
}

module.exports.bootstrapDatabase = bootstrap_with_config;
