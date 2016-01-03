import React from 'react'
import Bacon from 'baconjs'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import Promise from 'bluebird'
import R from 'ramda'
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
        urlParams: []
    }
}

const searchResultsS = inputBus.flatMap((courseName) => {
    if (courseName.length > 2) {
        let responseP = request.get('course/course').query({name: courseName})
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

const emailS = emailBus.flatMap((event) => console.log('email send' + event.address, window.location.href))

const Header = (url) =>
    <div className="header-container">
        <div id="opensaveModal" className="modal-dialog">
            <div>
                <a href="#close" title="Close" className="close">X</a>
                <div>Send course selection URL to your email.</div>
                <form className="modal-input-container">
                    <input type="email" className="modal-input" id="saveEmail" placeholder="Email"/>
                    <button type="button" id="saveId" className="modal-button" data-dismiss="modal"
                            onClick={(e) => {console.log('e.target',e.target); emailBus.push({address: e.target.textContent, url})}}>Send
                    </button>
                </form>
            </div>
        </div>
        <a className="header-element header-link" href="/">Lukkarimaatti++</a>
        <a className="header-element header-save" href="#opensaveModal">Save</a>
    </div>

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
    emailS, (applicationState) => ({
        ...applicationState
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
                     selectedCoursesBus.push({
                        type: 'add',
                        courses: R.filter(function(c) {return c.course_name === e.target.textContent}, applicationState.courses),
                        applicationState})
                     }}>{c.course_name}</div>))
        (applicationState.courses) : undefined

const searchResults = (applicationState) =>
    R.map((c) => {
            const courses = R.filter((cc) => cc.course_code === c.course_code, applicationState.selectedCourses)
            return <div key={c.course_code} className="search-list-element">
                <div className="search-list-coursename">{c.course_code + " - " + c.course_name}</div>
                <div className="search-list-remove" onClick={() => {
                    selectedCoursesBus.push({
                            type: 'remove',
                            courses,
                            applicationState})
                    CourseParser.removeUrlParameter(c.course_code)}}>X
                </div>
            </div>
        }, R.uniqWith(R.eqBy(R.prop('course_code')))(applicationState.selectedCourses)
    )

export const renderPage = (applicationState) =>
    <body>
    {Header(applicationState.urlParams)}
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
                events={CourseParser.addDataToCalendar(applicationState)}
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
