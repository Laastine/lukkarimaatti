"use strict"

const pgDb = require('pg-db')
const Promise = require('bluebird')
const R = require('ramda')
const appConfig = require('./config')

const address = "postgres://" + appConfig.postgresUsername + ":" + appConfig.postgresPassword + "@" + appConfig.postgresUrl
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

module.exports = {

  isTableInitialized: (table) => client.queryOneAsync(`SELECT to_regclass(:table) IS NOT NULL AS exists`, {table})
    .then(R.prop('exists'))
    .catch((err) => console.error("isTableInitialized error", err.stack)),

  initializeDb: (table) => client.updateAsync(`CREATE TABLE course(course_id SERIAL,
  course_code VARCHAR(256) NOT NULL,
  course_name VARCHAR(256) NOT NULL,
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
    .catch((err) => console.error('initializeDb error', err.stack)),

  getCourseByName: (courseName) => client.queryAsync(`SELECT * FROM course WHERE LOWER(course_name) LIKE $1`, ['%' + courseName + '%']),

  getCourseByCode: (code) => client.queryAsync(`SELECT * FROM course WHERE course_code = (:code)`, {code}),

  getCourseByCodeAndGroup: (code, groupName) =>
    client.queryAsync(`SELECT * FROM course WHERE course_code = (:code) and group_name = (:groupName)`, {
      code,
      groupName
    }),

  prefetchCoursesByCode: (params) => {
    const insertGroupCondition = (groupName) => groupName ? " AND group_name = \'" + groupName + "\'" : ''
    const insertCodeCondition = (courseCode) => courseCode ? " OR course_code = \'" + courseCode + "\'" : ''
    if (params.length > 0) {
      let query = "SELECT * FROM course WHERE course_code = \'" + params[0].courseCode + "\'" + insertGroupCondition(params[0].groupName)
      if (params.length > 1) {
        query += R.reduce((a, b) => a + insertCodeCondition(b.courseCode) + insertGroupCondition(b.groupName), '', R.tail(params))
      }
      return client.queryAsync(query)
        .then((result) => result)
        .catch((error) => console.log('prefetchCoursesByCode error', error))
    }
  },

  insertCourse: (courseBatch) => client.queryAsync(buildInsertQueryString(courseBatch))
    .catch((error) => console.error('buildInsertQueryString error', error.stack)),

  cleanCourseTable: () => client.queryAsync("TRUNCATE TABLE course")
    .then((res) => res)
    .catch((error) => console.log('DB error', error.stack))
}

