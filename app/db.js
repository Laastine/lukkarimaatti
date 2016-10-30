// @flow
const pgDb = require('pg-db')
const Promise = require('bluebird')
const {reduce, prop, tail} = require('ramda')
const appConfig = require('./config')
const Logger = require('./logger')

const client = Promise.promisifyAll(pgDb(appConfig.postgresUrl))

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

  isTableInitialized: (table: string) => client.queryOneAsync(`SELECT to_regclass(:table) IS NOT NULL AS exists`, {table})  // eslint-disable-line
    .then(prop('exists'))
    .catch((err) => Logger.error('isTableInitialized error', err.stack)),

  initializeDb: () => client.updateAsync(`CREATE TABLE course(course_id SERIAL,
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
    .then(() => client.updateAsync(`CREATE INDEX course_name_search ON course (course_name)`))  // eslint-disable-line
    .catch((err) => Logger.error('initializeDb error', err.stack)),

  getCourseByName: (courseName: string) => client.queryAsync(`SELECT * FROM course WHERE LOWER(course_name) LIKE $1`, ['%' + courseName + '%']),  // eslint-disable-line

  getCourseByCodeAndGroup: (code: string, group: string) => client.queryAsync(`SELECT * FROM course WHERE course_code = (:code) AND group_name = (:group)`, {code, group}), // eslint-disable-line

  getCourseByCode: (code: string) => client.queryAsync(`SELECT * FROM course WHERE course_code = (:code)`, {code}), // eslint-disable-line

  getCourseByDepartment: (department: string) =>
    client.queryAsync(`SELECT * FROM course WHERE department = (:department)`, { // eslint-disable-line
      department
    }),

  prefetchCoursesByCode: (params: Array<{courseCode: string, groupName: string}>) => {
    const insertGroupCondition = (groupName) => groupName ? ' AND group_name = \'' + groupName + '\'' : ''
    const insertCodeCondition = (courseCode) => courseCode ? ' OR course_code = \'' + courseCode + '\'' : ''
    if (params.length > 0) {
      let query = 'SELECT * FROM course WHERE course_code = \'' + params[0].courseCode + '\'' + insertGroupCondition(params[0].groupName)
      if (params.length > 1) {
        query += reduce((a, b) => a + insertCodeCondition(b.courseCode) + insertGroupCondition(b.groupName), '', tail(params))
      }
      return client.queryAsync(query)
        .then((result) => result)
        .catch((error) => Logger.info('prefetchCoursesByCode error', error))
    }
    return []
  },

  insertCourse: (courseBatch: string[]) => client.queryAsync(buildInsertQueryString(courseBatch))
    .catch((error) => Logger.error('buildInsertQueryString error', error.stack)),

  cleanCourseTable: () => client.queryAsync('TRUNCATE TABLE course')
}

