enum DatabaseType {
    SqlLite,
    MySQL
}

function bootstrap_database(type : DatabaseType, config, finalCallback) {

    var tableName_zanderDetails = "ZanderDetails";
    var tableName_users = "Users";

    var nodeSql = require('nodesql');

    var builderStack = [];
    builderStack[0] = function(db, callback) {
        db.query("CREATE TABLE " + tableName_zanderDetails + " (id INT NOT NULL, version INT NOT NULL)", function(err) {
            console.log("Created version table");
            if (err)
                callback(err);

            db.insert(tableName_zanderDetails, { id : 0, version : -1 }, function(err) {
                callback(err)
            });
        })
    };
    builderStack[1] = function(db, callback) {
        db.query("CREATE TABLE " + tableName_users + " (id VARCHAR(36) NOT NULL, " +
            "username VARCHAR(20) NOT NULL, " +
            "email VARCHAR(30) NOT NULL, " +
            "password CHAR(128) NOT NULL, " +
            "timestamp INTEGER NOT NULL)", function(err) {
            console.log("Created user table");
            callback(err);
        })
    };

    function bootstrap(currentVersion, db, callback) {
        var upperVersion = builderStack.length - 1;
        var nextVersion = currentVersion + 1;

        if (currentVersion > upperVersion) {
            callback("Unknown version installed")
        } else if (currentVersion == upperVersion) {
            console.log("Current Version Installed");
            callback(null)
        } else {
            console.log("Update from " + currentVersion + " to " + nextVersion);
            builderStack[nextVersion](db, function (err) {
                console.log("Updated from " + currentVersion + " to " + nextVersion);
                if (err)
                    callback(err);
                else
                    db.update(tableName_zanderDetails, { version: nextVersion }, {id: 0}, function (err) {
                        console.log("ZanderDetails version updated to " + nextVersion);
                        if (err)
                            callback(err);
                        else
                            bootstrap(nextVersion, db, callback);
                    });
            })
        }
    }

    function bootstrap_with_connection(db, callback) {
        db.select(tableName_zanderDetails, function(err, value) {
            if (err || !value || value.length < 1) {
                bootstrap(-1, db, callback);
            }
            else
                bootstrap(value[0].version, db, callback);
        })
    }

    switch(type) {
        case DatabaseType.SqlLite:
            var sqlite3 = require('sqlite3').verbose();
            var databaseString = config.sqlite || ':memory:';
            console.log("Sqlite connection: " + databaseString);

            var connection = new sqlite3.Database(databaseString,
                function() {
                    var db = nodeSql.createSqliteStrategy(connection);
                    bootstrap_with_connection(db, function(err) { finalCallback(err, db); });
                });
            break;

        case DatabaseType.MySQL:
            var mysql = require('mysql');
            var connection = mysql.createConnection(config.mysql);
            var db = nodeSql.createMySqlStrategy(connection);
            bootstrap_with_connection(db, function(err) { finalCallback(err, db); });
            break;

        default:
            finalCallback("Unrecognised database type", null);
    }
}

function bootstrap_with_config(config, callback) {
    if (config.mysql)
        bootstrap_database(DatabaseType.MySQL, config, callback);
    else {
        bootstrap_database(DatabaseType.SqlLite, config, callback);
    }
}

module.exports.bootstrapDatabase = bootstrap_with_config;
