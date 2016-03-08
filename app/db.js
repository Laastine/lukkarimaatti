"use strict"

const pg = require('pg')
const pgDb = require('pg-db')
const Promise = require('bluebird')
const R = require('ramda')
const appConfig = require('./config')

const db = Promise.promisifyAll(pg),
  address = "postgres://" + appConfig.postgresUsername + ":" + appConfig.postgresPassword + "@" + appConfig.postgresUrl

const client = Promise.promisifyAll(pgDb(address))

const buildInsertQueryString = (courseBatch) =>
  R.reduce((a, course) => a + "INSERT INTO course (" +
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
    course.group_name + "\');", ''
    , courseBatch)

const buildErrorMessage = (functionName, query, ip, err) => {
  const ipParam = ip ? ' IP: ' + ip : ''
  const queryParam = typeof query === 'object' ? JSON.stringify(query) : query
  console.error(functionName + ', request' + queryParam + ipParam + ' error', err)
}

module.exports = {

  isTableInitialized: (table) => client.queryOneAsync(`SELECT to_regclass(:table) IS NOT NULL AS exists`, {table})
    .then(R.prop('exists'))
    .catch((err) => console.error("isTableInitialized error", err.stack)),

  initializeDb: (table) => client.updateAsync(`CREATE TABLE course(course_id SERIAL,
  course_code VARCHAR(256) NOT NULL,
  course_name VARCHAR(256) NOT NULL,
  period VARCHAR(256),
  week VARCHAR(256),
  week_day VARCHAR(256),
  time_of_day VARCHAR(256),
  classroom VARCHAR(256),
  type VARCHAR(256),
  department VARCHAR(256),
  teacher VARCHAR(256),
  misc VARCHAR(512),
  group_name VARCHAR(256) DEFAULT '' NOT NULL)`)
    .then(() => client.updateAsync(`CREATE INDEX course_name_search ON course (course_name)`))
    .catch((err) => console.error('initializeDb', err.stack)),

  getCourseByName: (req, res) =>
    db.connectAsync(address)
      .spread((connection, release) => {
        const query = "SELECT * FROM course WHERE LOWER(course_name) LIKE \'%" + req.query['name'].toLocaleLowerCase() + '%\''
        return connection.queryAsync(query)
          .then((result) => res.json(result.rows))
          .error((error) => console.err('DB error=', error.stack))
          .finally(() => release())
      })
      .catch((err) => {
        buildErrorMessage('getCourseByName', req.query['name'], req.client.remoteAddress, err)
        return []
      }),

  getCourseByCode: (req, res) =>
    db.connectAsync(address)
      .spread((connection, release) => {
        const query = "SELECT * FROM course WHERE course_code = \'" + req.params['code'] + "\'"
        return connection.queryAsync(query)
          .then((result) => res.json(result.rows))
          .error((error) => console.log('DB error=', error))
          .finally(() => release())
      })
      .catch((err) => {
        buildErrorMessage('getCourseByName', req.params['code'], req.client.remoteAddress, err)
        return []
      }),

  prefetchCoursesByCode: (params) => {
    const insertGroupCondition = (groupName) => groupName ? " AND group_name = \'" + groupName + "\'" : ''
    const insertCodeCondition = (courseCode) => courseCode ? " OR course_code = \'" + courseCode + "\'" : ''
    if (params.length > 0) {
      return db.connectAsync(address)
        .spread((connection, release) => {
          let query = "SELECT * FROM course WHERE course_code = \'" + params[0].courseCode + "\'" + insertGroupCondition(params[0].groupName)
          if (params.length > 1) {
            query += R.reduce((a, b) => a + insertCodeCondition(b.courseCode) + insertGroupCondition(b.groupName), '', R.tail(params))
          }
          return connection.queryAsync(query)
            .then((result) => result.rows)
            .error((error) => console.log('DB error=', error))
            .finally(() => release())
        })
        .catch((err) => {
          buildErrorMessage('prefetchCoursesByCode', params, '', err)
          return []
        })
    }
  },

  getCourseByCodeAndGroup: (req, res) =>
    db.connectAsync(address)
      .spread((connection, release) => {
        const query = "SELECT * FROM course WHERE course_code = \'" + req.query['code'] + "\' and group_name = \'" + req.query['groupName'] + "\'"
        return connection.queryAsync(query)
          .then((result) => res.json(result.rows))
          .error((error) => console.log('DB error=', error))
          .finally(() => release())
      })
      .catch((err) => {
        buildErrorMessage('getCourseByCodeAndGroup', req.query['code'] + ' ' + req.query['groupName'], req.client.remoteAddress, err)
        return []
      }),

  insertCourse: (courseBatch) => {
    const query = buildInsertQueryString(courseBatch)
    db.connectAsync(address)
      .spread((connection, release) => {
        return connection.queryAsync(query)
          .error((error) => console.error('DB insert error=', error.stack))
          .finally(() => release())
      })
      .catch((err) => {
        buildErrorMessage('insertCourse', query, '', err)
        return []
      })
  },


  cleanCourseTable: () => db.connectAsync(address)
    .spread((connection, release) => {
      const query = "TRUNCATE TABLE course"
      return connection.queryAsync(query)
        .then((res) => res)
        .error((error) => console.log('DB error=', error.stack))
        .finally(() => release())
    })
    .catch((err) => {
      buildErrorMessage('cleanCourseTable', '', '', err)
      return []
    })
}

