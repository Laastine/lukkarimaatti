import assert from 'assert'
import {contains, all} from 'ramda'
import {parseDepartmentHtml} from '../../app/parser'
import {courseData} from './courseData'

const titeData = parseDepartmentHtml(courseData)

describe('Lukkarimaatti parser', () => {
  it('Check that every course gets parsed', () => {
    assert.equal(titeData.length, 153)
  })

  it('Check that correct object keys are found', () => {
    assert.equal(all((e) => {
      return contains('course_name')(Object.keys(e)) &&
        contains('course_code')(Object.keys(e)) &&
        contains('week')(Object.keys(e)) &&
        contains('week_day')(Object.keys(e)) &&
        contains('time_of_day')(Object.keys(e)) &&
        contains('classroom')(Object.keys(e)) &&
        contains('type')(Object.keys(e)) &&
        contains('department')(Object.keys(e)) &&
        contains('teacher')(Object.keys(e)) &&
        contains('misc')(Object.keys(e)) &&
        contains('group_name')(Object.keys(e))
    })(titeData), true)
  })

  it('Check that correct object values are present', () => {
    assert.deepEqual(titeData[0], { course_code: 'CT10A0015',
      course_name: 'Introduction to M.Sc. Studies in Computer Science',
      week: '44',
      week_day: 'to',
      time_of_day: '10-12',
      classroom: '4504',
      type: 'L',
      department: 'tite',
      teacher: '',
      misc: '',
      group_name: '' })
  })
})
