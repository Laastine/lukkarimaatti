const Promise = require('bluebird')
const pgp = require('pg-promise')({
  promiseLib: Promise
})
const {reduce, prop, tail} = require('ramda')
const appConfig = require('./config')
const Logger = require('./logger')

const client = pgp(appConfig.postgresUrl)

const charsRegex = /[\0\b\t\n\r\x1a"'\\]/g
const charsMap = {
  '\0': '\\0',
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\r': '\\r',
  '\x1a': '\\Z',
  '"': '\\"',
  '\'': '\'\'',
  '\\': '\\\\'
}

const sanitize = value => {
  let chunkIndex = charsRegex.lastIndex = 0
  let escapedVal = ''
  let match

  while ((match = charsRegex.exec(value))) {
    escapedVal += value.slice(chunkIndex, match.index) + charsMap[match[0]]
    chunkIndex = charsRegex.lastIndex
  }

  if (chunkIndex === 0) {
    return `${value}`
  }

  if (chunkIndex < value.length) {
    return `${escapedVal}${value.slice(chunkIndex)}`
  }

  return escapedVal
}

const SQL = (queryParts, ...values) =>
  queryParts.reduce((query, queryPart, i) => {
    const valueExists = i < values.length
    const text = query + queryPart

    return valueExists ? text + sanitize(values[i]) : text
  }, '')

const buildInsertQueryString = courseBatch => reduce((a, course) => {
  const insertQuery = SQL`INSERT INTO course (course_code, course_name, week, week_day, time_of_day, classroom, type, department, teacher, misc, group_name) VALUES ('${course.course_code}', 
    '${course.course_name}', 
    '${course.week}', 
    '${course.week_day}', 
    '${course.time_of_day}', 
    '${course.classroom}', 
    '${course.type}', 
    '${course.department}', 
    '${course.teacher}', 
    '${course.misc}', 
    '${course.group_name}');`
  return `${a} ${insertQuery}`
}, '', courseBatch)

module.exports = {

  isTableInitialized: table => client.query(SQL`SELECT to_regclass('${table}') IS NOT NULL as EXISTS;`)
    .then(e => prop('exists')(e[0]))
    .catch(err => Logger.error('isTableInitialized error', err.stack)),

  initializeDb: () => client.none(SQL`
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE course(course_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  week TEXT,
  week_day TEXT,
  time_of_day TEXT,
  classroom TEXT,
  type TEXT,
  department TEXT NOT NULL,
  teacher TEXT,
  misc TEXT,
  group_name TEXT DEFAULT '' NOT NULL);`)
    .then(() => {
      Logger.info('DB initialized')
      return client.any('CREATE INDEX course_name_search ON course (course_name)')
    })
    .catch(err => Logger.error('initializeDb error', err.stack)),

  getCourseByName: courseName => client.query(SQL`SELECT * FROM course WHERE LOWER(course_name) LIKE LOWER('%${courseName}%')`),

  getCourseByCodeAndGroup: (code, group) => client.query(SQL`SELECT * FROM course WHERE course_code = '${code}' AND group_name = '${group}'`),

  getCourseByCode: code => client.query(SQL`SELECT * FROM course WHERE course_code = '${code}'`),

  getCourseByDepartment: department => client.query(SQL`SELECT * FROM course WHERE department = LOWER('${department}')`),

  prefetchCoursesByCode: params => {
    const insertGroupCondition = groupName => groupName ? SQL` AND group_name = '${groupName}'` : ''
    const insertCodeCondition = courseCode => courseCode ? SQL` OR course_code = '${courseCode}'` : ''
    if (params.length > 0) {
      let query = SQL`SELECT * FROM course WHERE course_code = '${params[0].courseCode}'${insertGroupCondition(params[0].groupName)}`
      if (params.length > 1) {
        query += reduce((a, b) => a + insertCodeCondition(b.courseCode) + insertGroupCondition(b.groupName), '', tail(params))
      }
      return client.query(query)
        .then(result => result)
        .catch(error => Logger.info('prefetchCoursesByCode error', error))
    }
    return []
  },

  insertCourse: courseBatch => client.query(buildInsertQueryString(courseBatch))
    .catch(error => Logger.error('buildInsertQueryString error', error.stack)),

  updateKikeCourseCode: (courseCode, courseName) =>
    client.query(SQL`UPDATE course SET course_code = '${courseCode}' WHERE course_name ILIKE '${courseName}' AND department = 'kike';`)
      .catch(error => Logger.error('updateCourseCode error', error.stack)),

  cleanCourseTable: () => client.query('TRUNCATE TABLE course;'),

  cleanKikeCourseTable: () => client.query(SQL`DELETE FROM course WHERE department = '${'kike'}';`),

  SQL
}

