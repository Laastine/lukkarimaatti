import {flatten} from 'ramda'
import moment from 'moment'
import 'moment/locale/fi'

const getYearNumber = (courseWeekNumber) => {
  const isSpringSemester = moment().week() === 53 || moment().week() < 26
  const week = parseInt(courseWeekNumber, 10)
  const springCourse = (week > 0 && week < 35 || week === 53)
  if (isSpringSemester) {
    return springCourse ? moment().year() : moment().subtract(1, 'year').year()
  } else {
    return springCourse ? moment().add(1, 'y').year() : moment().year()
  }
}

export const addDataToCalendar = (state) => {
  const getTimestamp = (course, weekNumber, hour) =>
    moment(getYearNumber(course.week) + '-' + weekNumber + '-' + course.week_day + '-' + hour, 'YYYY-ww-dd-hh')
  return state.selectedCourses && state.selectedCourses.length > 0 ? flatten(state.selectedCourses.map((course) => {
    return JSON.parse('[' + course.week + ']').map((weekNumber) => {
      return {
        title: course.course_name,
        description: '/' + course.type + '\n' + course.classroom,
        start: new Date(getTimestamp(course, weekNumber, course.time_of_day.split('-')[0] || 6)),
        end: new Date(getTimestamp(course, weekNumber, course.time_of_day.split('-')[1] || 6)),
        id: course.course_code + '#' + course.type
      }
    })
  })) : []
}
