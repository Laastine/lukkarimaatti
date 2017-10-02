/* eslint-env mocha */
import assert from 'assert'
import {contains, all} from 'ramda'
import {parseHtml} from '../../app/parser'
import {ctCourseData, bhCourseData, aCourseData, blCourseData} from './courseData'

const titeData = parseHtml(ctCourseData)
const enteData = parseHtml(bhCourseData)
const katiData = parseHtml(aCourseData)
const sateData = parseHtml(blCourseData)

describe('Tite course parser', () => {
  it('Check that every course gets parsed', () => {
    assert.equal(titeData.length, 3)
  })

  it('Check that correct object keys are found', () => {
    assert.equal(all((e) => contains('course_name')(Object.keys(e)) &&
        contains('course_code')(Object.keys(e)) &&
        contains('week')(Object.keys(e)) &&
        contains('week_day')(Object.keys(e)) &&
        contains('time_of_day')(Object.keys(e)) &&
        contains('classroom')(Object.keys(e)) &&
        contains('type')(Object.keys(e)) &&
        contains('department')(Object.keys(e)) &&
        contains('teacher')(Object.keys(e)) &&
        contains('misc')(Object.keys(e)) &&
        contains('group_name')(Object.keys(e)))(titeData), true)
  })

  it('Check that correct object values are present', () => {
    assert.deepEqual(titeData[0], {course_code: 'CT60A2411',
      course_name: 'Olio-ohjelmointi',
      week: '36',
      week_day: 'ma',
      time_of_day: '12-14',
      classroom: 'Aloitusluennot 4511',
      type: 'L',
      department: 'tite',
      teacher: '',
      misc: '',
      group_name: ''})
  })
})

describe('Lukkarimaatti ente course parser', () => {
  it('Check that every course gets parsed', () => {
    assert.equal(enteData.length, 7)
  })

  it('Check that correct object keys are found', () => {
    assert.equal(all((e) => contains('course_name')(Object.keys(e)) &&
        contains('course_code')(Object.keys(e)) &&
        contains('week')(Object.keys(e)) &&
        contains('week_day')(Object.keys(e)) &&
        contains('time_of_day')(Object.keys(e)) &&
        contains('classroom')(Object.keys(e)) &&
        contains('type')(Object.keys(e)) &&
        contains('department')(Object.keys(e)) &&
        contains('teacher')(Object.keys(e)) &&
        contains('misc')(Object.keys(e)) &&
        contains('group_name')(Object.keys(e)))(enteData), true)
  })

  it('Check that correct object values are present', () => {
    assert.deepEqual(enteData[2], {course_code: 'BH40A1550',
      course_name: 'Computational Fluid Dynamics Workshop',
      week: '50',
      week_day: 'ti',
      time_of_day: '14-16',
      classroom: 'Yo-talo ML 213*',
      type: 'H',
      department: 'ente/ymte',
      teacher: '',
      misc: '',
      group_name: ''})
  })
})

describe('Lukkarimaatti kati course parser', () => {
  it('Check that every course gets parsed', () => {
    assert.equal(katiData.length, 12)
  })

  it('Check that correct object keys are found', () => {
    assert.equal(all((e) => contains('course_name')(Object.keys(e)) &&
        contains('course_code')(Object.keys(e)) &&
        contains('week')(Object.keys(e)) &&
        contains('week_day')(Object.keys(e)) &&
        contains('time_of_day')(Object.keys(e)) &&
        contains('classroom')(Object.keys(e)) &&
        contains('type')(Object.keys(e)) &&
        contains('department')(Object.keys(e)) &&
        contains('teacher')(Object.keys(e)) &&
        contains('misc')(Object.keys(e)) &&
        contains('group_name')(Object.keys(e)))(katiData), true)
  })

  it('Check that correct object values are present', () => {
    assert.deepEqual(katiData[6], {course_code: 'A130A0350',
      course_name: 'Kvantitatiiviset tutkimusmenetelmät',
      week: '16',
      week_day: 'ti',
      time_of_day: '08-14',
      classroom: '2303*',
      type: 'S',
      department: 'kati',
      teacher: '',
      misc: '',
      group_name: ''})
  })
})

describe('Lukkarimaatti sate course parser', () => {
  it('Check that every course gets parsed', () => {
    assert.equal(sateData.length, 3)
  })

  it('Check that correct object keys are found', () => {
    assert.equal(all((e) => contains('course_name')(Object.keys(e)) &&
        contains('course_code')(Object.keys(e)) &&
        contains('week')(Object.keys(e)) &&
        contains('week_day')(Object.keys(e)) &&
        contains('time_of_day')(Object.keys(e)) &&
        contains('classroom')(Object.keys(e)) &&
        contains('type')(Object.keys(e)) &&
        contains('department')(Object.keys(e)) &&
        contains('teacher')(Object.keys(e)) &&
        contains('misc')(Object.keys(e)) &&
        contains('group_name')(Object.keys(e)))(sateData), true)
  })

  it('Check that correct object values are present', () => {
    assert.deepEqual(sateData[0], {course_code: 'BL20A1600',
      course_name: 'Smart Grids',
      week: '10,11,12,13,14,15,16',
      week_day: 'ma',
      time_of_day: '13-15',
      classroom: '7339*',
      type: 'S',
      department: 'sate',
      teacher: '',
      misc: '',
      group_name: ''})

    assert.deepEqual(sateData[1], {course_code: 'BL20A1600',
      course_name: 'Smart Grids',
      week: '10,11,12,13,14,15,16',
      week_day: 'ti',
      time_of_day: '12-14',
      classroom: '7339*',
      type: 'S',
      department: 'sate',
      teacher: '',
      misc: '',
      group_name: ''})

    assert.deepEqual(sateData[2], {course_code: 'BL20A1600',
      course_name: 'Smart Grids',
      week: '2,3,4,5,6,7,8',
      week_day: 'ti',
      time_of_day: '16-18',
      classroom: 'Viipuri-sali*',
      type: 'L',
      department: 'sate',
      teacher: '',
      misc: '',
      group_name: ''})
  })
})

