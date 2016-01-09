import React from 'react'
import Bacon from 'baconjs'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import Promise from 'bluebird'
import R from 'ramda'
import Header from '../partials/header'
import searchResults from '../partials/searchResults'
import searchList from '../partials/searchList'
import CourseParser from '../util/courseParser'
const request = Promise.promisify(require('superagent'))
require('moment/locale/fi')
BigCalendar.momentLocalizer(moment)

export const pagePath = '/'
export const pageTitle = 'Lukkarimaatti++'

const inputBus = new Bacon.Bus()
const selectedCoursesBus = new Bacon.Bus()
const emailBus = new Bacon.Bus()

export const initialState = (urlCourses = []) => {
    return {
        selectedCourses: urlCourses,
        currentDate: moment(),
        courses: [],
        isSearchListVisible: false,
        urlParams: [],
        isModalOpen: false
    }
}

const searchResultsS = inputBus.flatMap((courseName) => {
    if (courseName.length > 2) {
        const responseP = request.get('course/course').query({name: courseName})
        return Bacon.fromPromise(responseP)
    } else {
        return {text: "[]"}
    }
})

const urlParamS = selectedCoursesBus.flatMapLatest((event) => {
    const course = R.head(event.courses)
    CourseParser.addUrlParameter(course.course_code, course.group_name)
    return [course.group_name ? course.course_code + '&' + course.group_name : course.course_code]
})

const selectedCourseS = selectedCoursesBus.flatMapLatest((event) => {
    if (event.type === 'add') {
        return R.flatten(R.reduce((a, b) => [a].concat([b]), event.applicationState.selectedCourses, event.courses))
    } else if (event.type === 'remove') {
        return R.filter((c) => c.course_code !== event.courses[0].course_code, event.applicationState.selectedCourses)
    } else {
        throw new Error('Unknown action')
    }
})

const modalS = emailBus.flatMapLatest((event) => {
    if (event.isModalOpen && event.address) {
        let responseP = request.post('api/save').send({
            email: event.address.toString(),
            link: window.location.href.toString()
        })
        return Bacon.fromPromise(responseP)
            .map({isModalOpen: false})
            .mapError({isModalOpen: true})
    }
    return event.isModalOpen
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
    selectedCourseS, (applicationState, selectedCourses) => ({
        ...applicationState,
        selectedCourses
    }),
    urlParamS, (applicationState, param) => ({
        ...applicationState,
        urlParams: R.append(param, applicationState.urlParams)
    }),
    modalS, (applicationState, isModalOpen) => ({
        ...applicationState,
        isModalOpen
    })
).doLog('state')

export const renderPage = (applicationState) =>
    <body>
    {Header(applicationState, emailBus)}
    <div className="container">

        {searchList(applicationState, inputBus, selectedCoursesBus)}

        <div className="selected-courses-list">
            <div className="selected-courses-list-topic">Selected courses:</div>
            {searchResults(applicationState, selectedCoursesBus, CourseParser)}
        </div>
        <div>
            <BigCalendar
                events={CourseParser.addDataToCalendar(applicationState)}
                defaultView="week"
                views={['month', 'week', 'day']}
                formats={{
                    dayHeaderFormat: "ddd D.M",
                    dayFormat: "ddd D.M"
                }}
                onSelectEvent={event => console.log(event)}
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
