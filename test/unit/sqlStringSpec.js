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

  it('Should handle multi value insert', () => {
    const courseCode = 'CT30A3202'
    const courseName = 'WWW-sovellukset'
    const department = 'tite'
    const input = SQL`INSERT INTO course (course_id, course_code, course_name, week, week_day, time_of_day, classroom, type, department, teacher, misc, group_name) VALUES 
          ('C0C630CD-0444-47D6-B1A1-9377047DA8B2', '${courseCode}', '${courseName}', '36', 'ti', '12-14', 'Johdantoluento. 2208', 'L', '${department}', '', '', ''),
          ('C0C630CD-0444-47D6-B1A1-9377047DA8B3', '${courseCode}', '${courseName}', '37,38,39,40,41,42,43,44,45,46,47,48,49,50', 'to', '12-14', '6218 ML, LINUX*', 'H', '${department}', '', '', '');`
    assert.deepEqual(input, `INSERT INTO course (course_id, course_code, course_name, week, week_day, time_of_day, classroom, type, department, teacher, misc, group_name) VALUES 
          ('C0C630CD-0444-47D6-B1A1-9377047DA8B2', 'CT30A3202', 'WWW-sovellukset', '36', 'ti', '12-14', 'Johdantoluento. 2208', 'L', 'tite', '', '', ''),
          ('C0C630CD-0444-47D6-B1A1-9377047DA8B3', 'CT30A3202', 'WWW-sovellukset', '37,38,39,40,41,42,43,44,45,46,47,48,49,50', 'to', '12-14', '6218 ML, LINUX*', 'H', 'tite', '', '', '');`)
  })
})
