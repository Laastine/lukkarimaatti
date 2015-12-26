import React from 'react'
import Bacon from 'baconjs'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import Promise from 'bluebird'
import R from 'ramda'
const request = Promise.promisify(require('superagent'))
require('moment/locale/fi')
export const pagePath = '/'

export const pageTitle = 'Lukkarimaatti++'

const inputBus = new Bacon.Bus()
const selectedCoursesBus = new Bacon.Bus()

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
)

export const initialState = {
    selectedCourses: [],
    currentDate: moment(),
    courses: []
}

const searchResultsS = inputBus.flatMap((courseName) => {
    if (courseName.length > 2) {
        let responseP = request.get('course/course').query({name: courseName})
        return Bacon.fromPromise(responseP)
    } else {
        return {text: "[]"}
    }
})

export const applicationStateProperty = (initialState) => Bacon.update(
    initialState,
    inputBus, (applicationState, input) => ({
        ...applicationState,
        input
    }),
    searchResultsS, (applicationState, courseNames) => ({
        ...applicationState,
        courses: JSON.parse(courseNames.text)
    }),
    selectedCoursesBus, (applicationState, selectedCourse) => ({
        ...applicationState,
        selectedCourses: R.filter((c) => c.course_name === selectedCourse, applicationState.courses)
    })
).doLog('application state')

const searchList = (applicationState) =>
    R.pipe(R.map((c) => c.course_name),
        R.uniq,
        R.map((cname) =>
            <div key={cname}
                 className="search-list-coursename"
                 onClick={(e) => selectedCoursesBus.push(e.target.textContent)}>{cname}</div>))
    (applicationState.courses)

export const renderPage = (applicationState) =>
    <body>
    <div className="container">
        <div className="search-container">
            <input id="course-searchbox" onKeyUp={(event) => inputBus.push(event.target.value)}></input>
        </div>
        <div className="search-list-container">
            {searchList(applicationState)}
        </div>
        <div>
            <BigCalendar
                events={addDataToCalendar(applicationState)}
                defaultView="week"
                min={new Date(moment(applicationState.currentDate).hours(8).minutes(0).format())}
                max={new Date(moment(applicationState.currentDate).hours(20).minutes(0).format())}
                defaultDate={new Date(moment(applicationState.currentDate).format())}
            />
        </div>
    </div>
    </body>

const addDataToCalendar = (applicationState) => {
    const getTimestamp = (course, weekNumber, hour) => moment()
        .locale('fi')
        .year(getYearNumber(course.week))
        .day(course.week_day)
        .week(weekNumber)
        .hours(hour)
        .minutes(0)
        .seconds(0)
        .format()
    return R.flatten(applicationState.selectedCourses.map((course) =>
        JSON.parse('[' + course.week + ']').map((weekNumber) => {
            return {
                title: course.course_code + "-" + course.course_name,
                description: course.course_name + '/' + course.type + '\n' + course.classroom,
                start: new Date(getTimestamp(course, weekNumber, course.time_of_day.split('-')[0] || 6)),
                end: new Date(getTimestamp(course, weekNumber, course.time_of_day.split('-')[1] || 6)),
                element: null,
                color: stringToColour(course.course_code),
                view: null,
                id: course.course_code + '#' + course.type
            }
        })
    ))
}

const getYearNumber = (courseWeekNumber) => {
    const isSpringSemester = moment().week() < 27
    const week = parseInt(courseWeekNumber, 10)
    const springCourse = (week > 0 && week < 35)
    if (isSpringSemester) {
        return springCourse ? moment().year() : moment().subtract(1, 'year').year()
    } else {
        return springCourse ? moment().add(1, 'y').year() : moment().year()
    }
}

const stringToColour = (colorSeed) => {
    let colour = '#', value
    let hash = colorSeed.split("").map(function(e) {
        colorSeed.charCodeAt(e) + ((hash << 5) - hash)
    })
    for (var j = 0; j < 3; j++) {
        value = (hash >> (j * 8)) & 0xFF
        colour += ('00' + value.toString(16)).substr(-2)
    }
    return colour
}