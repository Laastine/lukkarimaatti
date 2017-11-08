/* eslint-env mocha */
import assert from 'assert'
import {SQL} from '../../app/db'

describe('SQL sanitizer', () => {
  it('Should handle happy case', () => {
    const courseCode = 'CT60A2411'
    const courseName = 'Olio-ohjelmointi'
    const input = SQL`UPDATE course SET course_code = '${courseCode}' WHERE course_name ILIKE '${courseName}' AND department = 'kike';`
    assert.deepEqual(input, 'UPDATE course SET course_code = \'CT60A2411\' WHERE course_name ILIKE \'Olio-ohjelmointi\' AND department = \'kike\';')
  })

  it('Should escape malicious characters', () => {
    const courseCode = 'CT6\'0A24\\\\11'
    const courseName = 'Olio-o\u00A9hjelmointi'
    const input = SQL`UPDATE course SET course_code = '${courseCode}' WHERE course_name ILIKE '${courseName}' AND department = 'kike';`
    assert.deepEqual(input, 'UPDATE course SET course_code = \'CT6\'\'0A24\\\\\\\\11\' WHERE course_name ILIKE \'Olio-o©hjelmointi\' AND department = \'kike\';')
  })

  it('Should escape malicious characters from SELECT query', () => {
    const courseName = 'master\'s'
    const input = SQL`SELECT * FROM course WHERE LOWER(course_name) LIKE LOWER('%${courseName}%')`
    assert.deepEqual(input, 'SELECT * FROM course WHERE LOWER(course_name) LIKE LOWER(\'%master\'\'s%\')')
  })

  it('Should handle empty case', () => {
    const courseCode = ''
    const courseName = ''
    const input = SQL`UPDATE course SET course_code = '${courseCode}' WHERE course_name ILIKE '${courseName}' AND department = 'kike';`
    assert.deepEqual(input, 'UPDATE course SET course_code = \'\' WHERE course_name ILIKE \'\' AND department = \'kike\';')
  })
})
