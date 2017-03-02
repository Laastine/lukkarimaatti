import assert from 'assert'
import {contains, all} from 'ramda'
import {parseDepartmentHtml} from '../../app/parser'
import {courseData, kikeCourseData} from './courseData'

const titeData = parseDepartmentHtml(courseData)
const kikeData = parseDepartmentHtml(kikeCourseData)

describe('Lukkarimaatti normal course parser', () => {
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

describe('Lukkarimaatti kike course parser', () => {
  it('Check that every course gets parsed', () => {
    assert.equal(kikeData.length, 302)
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
    })(kikeData), true)
  })

  it('Check that correct object values are present', () => {
    assert.deepEqual(kikeData[0], { course_code: 'FV11A4401',
      course_name: 'English Communication for Engineering Professionals: E',
      week: '2,3,4,5,6,7,8,10,11,12,13,14,15,16',
      week_day: 'to',
      time_of_day: '10-12',
      classroom: '6517*',
      type: '',
      department: 'kike',
      teacher: '',
      misc: '',
      group_name: 'E' })
  })
})

