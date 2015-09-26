var pg = require("pg"),
    Promise = require("bluebird"),
    appConfig = require('./config')

var db = Promise.promisifyAll(pg),
    connection,
    address = "pg://" + appConfig.postgresUsername + ":" + appConfig.postgresPassword + "@" + appConfig.postgresUrl

module.exports = {
    getCourseByName: function(req, res) {
        db.connectAsync(address)
            .spread(function(connection, release) {
                var query = "SELECT * FROM course WHERE LOWER(course_name) LIKE \'%" + req.query['name'] + '%\''
                console.log(query)
                return connection.queryAsync(query)
                    .then(function(result) {
                        res.json(result.rows)
                    })
                    .error(function(error) {
                        console.log('DB error=', error)
                    })
                    .finally(function() {
                        release();
                    });
            })
    },

    getCourseByCode: function(req, res) {
        db.connectAsync(address)
            .spread(function(connection, release) {
                var query = "SELECT * FROM course WHERE course_code = \'" + req.params['code'] + "\'"
                console.log(query)
                return connection.queryAsync(query)
                    .then(function(result) {
                        res.json(result.rows)
                    })
                    .error(function(error) {
                        console.log('DB error=', error)
                    })
                    .finally(function() {
                        release();
                    });
            })
    },

    getCourseByCodeAndGroup: function(req, res) {
        db.connectAsync(address)
            .spread(function(connection, release) {
                var query = "SELECT * FROM course WHERE course_code = \'" + req.query['code'] + "\' and group_name = \'" + req.query['groupName'] + "\'"
                console.log(query)
                return connection.queryAsync(query)
                    .then(function(result) {
                        res.json(result.rows)
                    })
                    .error(function(error) {
                        console.log('DB error=', error)
                    })
                    .finally(function() {
                        release();
                    });
            })
    },

    insertCourse: function(courseBatch) {
        var query = buildInsertQueryString(courseBatch)
        console.log('insertCourse', query.length)
        db.connectAsync(address)
            .spread(function(connection, release) {
                return connection.queryAsync(query)
                    .error(function(error) {
                        console.log('DB insert error=', error)
                    })
                    .finally(function() {
                        release();
                    });
            })
    },

    cleanTable: function() {
        console.log('cleanTable')
        db.connectAsync(address)
            .spread(function(connection, release) {
                var query = "TRUNCATE TABLE course"
                console.log(query)
                return connection.queryAsync(query)
                    .error(function(error) {
                        console.log('DB error=', error)
                    })
                    .finally(function() {
                        release();
                    });
            })
    }
}

var buildInsertQueryString = function(courseBatch) {
    var query = ''
    courseBatch.forEach(function(course) {
        query += "INSERT INTO course (" +
            "course_code, course_name, week, week_day, time_of_day, classroom, type, department, teacher, misc, group_name) " +
            "VALUES (\'" +
            course.course_code + "\',\'" +
            course.course_name + "\',\'" +
            course.week + "\',\'" +
            course.week_day + "\',\'" +
            course.time_of_day + "\',\'" +
            course.classroom + "\',\'" +
            course.type + "\',\'" +
            course.department + "\',\'" +
            course.teacher + "\',\'" +
            course.misc + "\',\'" +
            course.group_name + "\');"
    })
    return query
}

