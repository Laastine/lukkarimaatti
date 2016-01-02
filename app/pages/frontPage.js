import React from 'react'
import Bacon from 'baconjs'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import Promise from 'bluebird'
import R from 'ramda'
const request = Promise.promisify(require('superagent'))
require('moment/locale/fi')
BigCalendar.momentLocalizer(moment)

export const pagePath = '/'
export const pageTitle = 'Lukkarimaatti++'

const inputBus = new Bacon.Bus()
const selectedCoursesBus = new Bacon.Bus()

export const initialState = {
    selectedCourses: [],
    currentDate: moment(),
    courses: [],
    isSearchListVisible: false,
    urlParams: []
}

const searchResultsS = inputBus.flatMap((courseName) => {
    if (courseName.length > 2) {
        let responseP = request.get('course/course').query({name: courseName})
        return Bacon.fromPromise(responseP)
    } else {
        return {text: "[]"}
    }
}).doLog('input')

const urlParamS = selectedCoursesBus.flatMapLatest((course) => {
    console.log('stream', course)
    addUrlParameter(course.course_code, course.group_name)
    return [course.group_name ? course.course_code + '&' + course.group_name : course.course_code]
})

export const applicationStateProperty = (initialState) => Bacon.update(
    initialState,
    inputBus, (applicationState, input) => ({
        ...applicationState,
        input
    }),
    searchResultsS, (applicationState, courseNames) => ({
        ...applicationState,
        courses: JSON.parse(courseNames.text),
        isSearchListVisible: true
    }),
    selectedCoursesBus, (applicationState, selectedCourse) => ({
        ...applicationState,
        selectedCourses: R.append(selectedCourse, applicationState.selectedCourses)
    }),
    urlParamS, (applicationState, param) => ({
        ...applicationState,
        urlParams: R.append(param, applicationState.urlParams)
    })
).doLog('state')

const searchList = (applicationState) =>
    applicationState.isSearchListVisible ?
        R.pipe(
            R.uniqBy((c) => c.course_name),
            R.map((c) =>
                <div key={c.course_name}
                     className="search-list-coursename"
                     onClick={(e) => {
                     applicationState.isSearchListVisible = false
                     selectedCoursesBus.push(R.head(R.filter(function(c) {return c.course_name === e.target.textContent}, applicationState.courses)))
                     }}>{c.course_name}</div>))
        (applicationState.courses) : undefined

const searchResults = (applicationState) =>
    R.map((c) => <div key={c.course_code}
                      className="search-list-coursename">{c.course_code + " - " + c.course_name}</div>, applicationState.selectedCourses)

export const renderPage = (applicationState) =>
    <body>
    <div className="container">
        <div className="search-container">
            <input id="course-searchbox" onKeyUp={(event) => inputBus.push(event.target.value)}></input>
        </div>
        <div className="search-list-container">
            {searchList(applicationState)}
        </div>
        <div className="selected-courses-list">
            <div className="selected-courses-list-topic">Selected courses:</div>
            {searchResults(applicationState)}
        </div>
        <div>
            <BigCalendar
                events={addDataToCalendar(applicationState)}
                defaultView="week"
                views={['month', 'week']}
                formats={{
                    dayFormat: "ddd D.M"
                }}
                min={new Date(moment(applicationState.currentDate).hours(8).minutes(0).format())}
                max={new Date(moment(applicationState.currentDate).hours(20).minutes(0).format())}
                defaultDate={new Date(moment(applicationState.currentDate).format())}
            />
        </div>
        <div className="footer">
            <div id="disclaimer">Use with your own risk!</div>
            <div id="versionInfo">v1.2.0</div>
        </div>
    </div>
    </body>

const addDataToCalendar = (applicationState) => {
    const getTimestamp = (course, weekNumber, hour) =>
        moment(getYearNumber(course.week) + '-' + weekNumber + '-' + course.week_day + '-' + hour, 'YYYY-ww-dd-hh')

    return R.flatten(applicationState.selectedCourses.map((course) =>
        JSON.parse('[' + course.week + ']').map((weekNumber) => {
            return {
                title: course.course_code + "-" + course.course_name + '/' + course.type + '\n' + course.classroom,
                start: new Date(getTimestamp(course, weekNumber, course.time_of_day.split('-')[0] || 6)),
                end: new Date(getTimestamp(course, weekNumber, course.time_of_day.split('-')[1] || 6)),
                color: stringToColour(course.course_code),
                id: course.course_code + '#' + course.type
            }
        })
    ))
}

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

const stringToColour = (colorSeed) => {
    let colour = '#', value
    let hash = colorSeed.split("").map(function (e) {
        colorSeed.charCodeAt(e) + ((hash << 5) - hash)
    })
    for (var j = 0; j < 3; j++) {
        value = (hash >> (j * 8)) & 0xFF
        colour += ('00' + value.toString(16)).substr(-2)
    }
    return colour
}

const inBrowser = () => typeof window != 'undefined'

const addUrlParameter = (course_code, group_name) => {
    console.log('addUrlParameter', course_code, group_name)
    const params = window.location.search
    const urlParam = course_code.substring(0, 2) === 'FV' ? course_code + '&' + group_name : course_code
    if (params.length > 0) {
        history.pushState(
            {}, "", "?" + params.substring(1, params.length) + '+' + urlParam)
    } else {
        history.pushState(
            {}, "", "?" + params + urlParam)
    }
}

const removeUrlParameter = (id) => {
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
        history.pushState({}, "", "?");
    }
}


const getDataOnRefresh = (calendar) => {
    const params = window.location.search
    const courseCodes = params.substring(1, params.length).split(/[+]/)
    if (courseCodes[0].length > 0) {
        courseCodes.forEach(function (param) {
            let groupLetter = ""
            if (param.indexOf('&') > -1) {
                groupLetter = param.substring(param.indexOf('&') + 1, param.length)
                param = param.substring(0, param.indexOf('&'))
            }
            if (typeof param !== 'undefined' && groupLetter.length > 0) {
                request.get('course/codeAndGroup').query({
                        groupName: groupLetter,
                        code: param
                    })
                    .then((data) => {
                    })
                    .error((err) => console.error('Reload error', err))
            } else if (typeof param !== 'undefined') {
                request.get('course/code' + param)
                    .then((data) => {
                    })
                    .error((err) =>  console.error('Reload error', err))
            }
        })
    }
}