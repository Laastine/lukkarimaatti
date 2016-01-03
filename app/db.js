import pg from 'pg'
import Promise from 'bluebird'
import R from 'ramda'
const appConfig = require('./config')

const db = Promise.promisifyAll(pg),
    address = "pg://" + appConfig.postgresUsername + ":" + appConfig.postgresPassword + "@" + appConfig.postgresUrl

const buildInsertQueryString = (courseBatch) => {
    let query = ''
    courseBatch.forEach((course) => {
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

module.exports = {
    getCourseByName: (req, res) => {
        db.connectAsync(address)
            .spread((connection, release) => {
                const query = "SELECT * FROM course WHERE LOWER(course_name) LIKE \'%" + req.query['name'] + '%\''
                return connection.queryAsync(query)
                    .then((result) => {
                        res.json(result.rows)
                    })
                    .error((error) => {
                        console.log('DB error=', error)
                    })
                    .finally(() => {
                        release()
                    })
            })
    },

    getCourseByCode: (req, res) => {
        db.connectAsync(address)
            .spread((connection, release) => {
                const query = "SELECT * FROM course WHERE course_code = \'" + req.params['code'] + "\'"
                return connection.queryAsync(query)
                    .then((result) => {
                        res.json(result.rows)
                    })
                    .error((error) => {
                        console.log('DB error=', error)
                    })
                    .finally(() => {
                        release()
                    })
            })
    },

    prefetchCoursesByCode: (params) => {
        if (params.length > 0) {
            return db.connectAsync(address)
                .spread((connection, release) => {
                    let query = "SELECT * FROM course WHERE course_code = \'" + params + "\'"
                    if (params.length > 1) {
                        query = R.reduce((a, b) => '' + a + b, query, R.tail(params))
                    }
                    return connection.queryAsync(query)
                        .then((result) => {
                            return result.rows
                        })
                        .error((error) => {
                            console.log('DB error=', error)
                        })
                        .finally(() => {
                            release()
                        })
                })
        }
    },

    getCourseByCodeAndGroup: (req, res) => {
        db.connectAsync(address)
            .spread((connection, release) => {
                const query = "SELECT * FROM course WHERE course_code = \'" + req.query['code'] + "\' and group_name = \'" + req.query['groupName'] + "\'"
                return connection.queryAsync(query)
                    .then((result) => {
                        res.json(result.rows)
                    })
                    .error((error) => {
                        console.log('DB error=', error)
                    })
                    .finally(() => {
                        release()
                    })
            })
    },

    insertCourse: (courseBatch) => {
        var query = buildInsertQueryString(courseBatch)
        db.connectAsync(address)
            .spread((connection, release) => {
                return connection.queryAsync(query)
                    .error((error) => {
                        console.log('DB insert error=', error)
                    })
                    .finally(()  => {
                        release()
                    })
            })
    },

    cleanCourseTable: () => {
        console.log('cleanCourseTable')
        db.connectAsync(address)
            .spread((connection, release) => {
                var query = "TRUNCATE TABLE course"
                return connection.queryAsync(query)
                    .error((error) => {
                        console.log('DB error=', error)
                    })
                    .finally(() => {
                        release()
                    })
            })
    }
}
