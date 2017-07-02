import assert from 'assert'
import {contains, all} from 'ramda'
import {parseHtml} from '../../app/parser'
import {courseData} from './courseData'

const titeData = parseHtml(courseData)

describe('Lukkarimaatti normal course parser', () => {
  it('Check that every course gets parsed', () => {
    assert.equal(titeData.length, 3)
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
    assert.deepEqual(titeData[0], { course_code: 'CT60A2411',
      course_name: 'Olio-ohjelmointi',
      week: '36',
      week_day: 'ma',
      time_of_day: '12-14',
      classroom: 'Aloitusluennot 4511',
      type: 'L',
      department: 'tite',
      teacher: '',
      misc: '',
      group_name: '' })
  })
})

