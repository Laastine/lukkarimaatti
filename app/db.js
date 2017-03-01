const Promise = require('bluebird')
const pgp = require('pg-promise')({
  promiseLib: Promise
})
const {reduce, prop, tail} = require('ramda')
const appConfig = require('./config')
const Logger = require('./logger')

const client = pgp(appConfig.postgresUrl)

const buildInsertQueryString = (courseBatch) =>
  reduce((a, course) => a + 'INSERT INTO course (' +
    'course_code, course_name, week, week_day, time_of_day, classroom, type, department, teacher, misc, group_name) ' +
    'VALUES (\'' +
    course.course_code + '\',\'' +
    course.course_name + '\',\'' +
    course.week + '\',\'' +
    course.week_day + '\',\'' +
    course.time_of_day + '\',\'' +
    course.classroom + '\',\'' +
    course.type + '\',\'' +
    course.department + '\',\'' +
    course.teacher + '\',\'' +
    course.misc + '\',\'' +
    course.group_name + '\');', ''
    , courseBatch)

module.exports = {

  isTableInitialized: (table) => client.query('SELECT ${columns^} IS NOT NULL AS exists', {columns: `to_regclass('${table}')`})
    .then((e) => prop('exists')(e[0]))
    .catch((err) => Logger.error('isTableInitialized error', err.stack)),

  initializeDb: () => client.none(`CREATE TABLE course(course_id SERIAL,
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
    .then(() => client.any(`CREATE INDEX course_name_search ON course (course_name)`))
    .catch((err) => Logger.error('initializeDb error', err.stack)),

  getCourseByName: (courseName) => client.query(`SELECT * FROM course WHERE LOWER(course_name) LIKE $1`, ['%' + courseName + '%']),  // eslint-disable-line

  getCourseByCodeAndGroup: (code, group) => client.query(`SELECT * FROM course WHERE course_code = ${code} AND group_name = ${group}`, {code, group}), // eslint-disable-line

  getCourseByCode: (code) => client.query(`SELECT * FROM course WHERE course_code = {code}`, {code}), // eslint-disable-line

  getCourseByDepartment: (department) =>
    client.query(`SELECT * FROM course WHERE department = {department}`, { // eslint-disable-line
      department
    }),

  prefetchCoursesByCode: (params) => {
    const insertGroupCondition = (groupName) => groupName ? ' AND group_name = \'' + groupName + '\'' : ''
    const insertCodeCondition = (courseCode) => courseCode ? ' OR course_code = \'' + courseCode + '\'' : ''
    if (params.length > 0) {
      let query = 'SELECT * FROM course WHERE course_code = \'' + params[0].courseCode + '\'' + insertGroupCondition(params[0].groupName)
      if (params.length > 1) {
        query += reduce((a, b) => a + insertCodeCondition(b.courseCode) + insertGroupCondition(b.groupName), '', tail(params))
      }
      return client.query(query)
        .then((result) => result)
        .catch((error) => Logger.info('prefetchCoursesByCode error', error))
    }
    return []
  },

  insertCourse: (courseBatch) => client.query(buildInsertQueryString(courseBatch))
    .catch((error) => Logger.error('buildInsertQueryString error', error.stack)),

  cleanCourseTable: () => client.query('TRUNCATE TABLE course')
}

