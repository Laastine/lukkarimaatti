var pg = require("pg"),
    Promise = require("bluebird"),
    appConfig = require('./config')

var db = Promise.promisifyAll(pg),
    address = "pg://" + appConfig.postgresUsername + ":" + appConfig.postgresPassword + "@" + appConfig.postgresUrl

module.exports = {
    getCourseByName: function(req, res) {
        db.connectAsync(address)
            .spread(function(connection, release) {
                var query = "SELECT * FROM course WHERE LOWER(course_name) LIKE \'%" + req.query['name'] + '%\''
                return connection.queryAsync(query)
                    .then(function(result) {
                        res.json(result.rows)
                    })
                    .error(function(error) {
                        console.log('DB error=', error)
                    })
                    .finally(function() {
                        release()
                    })
            })
    },

    getCourseByCode: function(req, res) {
        db.connectAsync(address)
            .spread(function(connection, release) {
                var query = "SELECT * FROM course WHERE course_code = \'" + req.params['code'] + "\'"
                return connection.queryAsync(query)
                    .then(function(result) {
                        res.json(result.rows)
                    })
                    .error(function(error) {
                        console.log('DB error=', error)
                    })
                    .finally(function() {
                        release()
                    })
            })
    },

    getCourseByCodeAndGroup: function(req, res) {
        db.connectAsync(address)
            .spread(function(connection, release) {
                var query = "SELECT * FROM course WHERE course_code = \'" + req.query['code'] + "\' and group_name = \'" + req.query['groupName'] + "\'"
                return connection.queryAsync(query)
                    .then(function(result) {
                        res.json(result.rows)
                    })
                    .error(function(error) {
                        console.log('DB error=', error)
                    })
                    .finally(function() {
                        release()
                    })
            })
    },

    insertCourse: function(courseBatch) {
        var query = buildInsertQueryString(courseBatch)
        db.connectAsync(address)
            .spread(function(connection, release) {
                return connection.queryAsync(query)
                    .error(function(error) {
                        console.log('DB insert error=', error)
                    })
                    .finally(function() {
                        release()
                    })
            })
    },

    cleanCourseTable: function() {
        console.log('cleanCourseTable')
        db.connectAsync(address)
            .spread(function(connection, release) {
                var query = "TRUNCATE TABLE course"
                return connection.queryAsync(query)
                    .error(function(error) {
                        console.log('DB error=', error)
                    })
                    .finally(function() {
                        release()
                    })
            })
    }
}
