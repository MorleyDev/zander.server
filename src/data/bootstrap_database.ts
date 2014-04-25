enum DatabaseType {
    SqlLite
}

function bootstrap_database(type : DatabaseType, callback) {

    var tableName_zanderDetails = "ZanderDetails";

    var nodeSql = require('nodesql');

    var builderStack = [];
    builderStack[0] = function(db, callback) {
        db.query("CREATE TABLE " + tableName_zanderDetails + " (id INT NOT NULL, version INT NOT NULL)", function(err) {
            console.log("Created table");
            if (err)
                callback(err);

            db.insert(tableName_zanderDetails, { id : 0, version : -1 }, function(err) {
                callback(err)
            });
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
        db.selectOne(tableName_zanderDetails, function(err, value) {
            if (err)
                bootstrap(-1, db, callback);
            else
                bootstrap(value.version, db, callback);
        })
    }

    switch(type) {
        case DatabaseType.SqlLite:
            var sqlite3 = require('sqlite3').verbose();
            var connection = new sqlite3.Database(':memory:',
                function() {
                    var db = nodeSql.createSqliteStrategy(connection);
                    bootstrap_with_connection(db, callback)
                });
            break;

        default:
            callback("Unrecognised database type")
    }
}

function bootstrap_with_config(config, callback) {
    bootstrap_database(DatabaseType.SqlLite, callback);
}

module.exports.bootstrapDatabase = bootstrap_with_config;
