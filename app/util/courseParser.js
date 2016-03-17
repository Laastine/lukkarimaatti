import R from 'ramda'
import moment from 'moment'
require('moment/locale/fi')

const getYearNumber = (courseWeekNumber) => {
    const isSpringSemester = moment().week() === 53 || moment().week() < 27
    const week = parseInt(courseWeekNumber, 10)
    const springCourse = (week > 0 && week < 35 || week === 53)
    if (isSpringSemester) {
        return springCourse ? moment().year() : moment().subtract(1, 'year').year()
    } else {
        return springCourse ? moment().add(1, 'y').year() : moment().year()
    }
}

export default {
    addDataToCalendar: (applicationState) => {
        const getTimestamp = (course, weekNumber, hour) =>
            moment(getYearNumber(course.week) + '-' + weekNumber + '-' + course.week_day + '-' + hour, 'YYYY-ww-dd-hh')
        return R.flatten(applicationState.selectedCourses.map((course) => {
            return JSON.parse('[' + course.week + ']').map((weekNumber) => {
                return {
                    title: course.course_name,
                    description: '/' + course.type + '\n' + course.classroom,
                    start: new Date(getTimestamp(course, weekNumber, course.time_of_day.split('-')[0] || 6)),
                    end: new Date(getTimestamp(course, weekNumber, course.time_of_day.split('-')[1] || 6)),
                    id: course.course_code + '#' + course.type
                }
            })
        }))
    },

    addUrlParameter: (course_code, group_name) => {
        const params = window.location.search
        const urlParam = course_code.substring(0, 2) === 'FV' ? course_code + '&' + group_name : course_code
        if (params.length > 0) {
            if (params.indexOf(course_code) < 0) {
                history.pushState({}, "", "?" + params.substring(1, params.length) + '+' + urlParam)
            }
        } else {
            history.pushState({}, "", "?" + params + urlParam)
        }
    },

    removeUrlParameter: (id) => {
        const params = window.location.search
        const updatedParams = params.substring(1, params.length).split('+').filter((p) => {
            if (p.indexOf('&') > -1) {
                var groupLetterStripped = p.substring(0, p.indexOf('&'))
                return groupLetterStripped !== id
            } else {
                return p !== id
            }
        })
        if (updatedParams.length > 0) {
            history.pushState({}, "", "?" + updatedParams.join('+'))
        } else {
            history.pushState({}, "", "?")
        }
    }
}
