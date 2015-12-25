import React from 'react'
import Bacon from 'baconjs'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import Promise from 'bluebird'
import R from 'ramda'
const request = Promise.promisify(require('superagent'))

export const pagePath = '/'

export const pageTitle = 'Lukkarimaatti++'

const dayBus = new Bacon.Bus()
const inputBus = new Bacon.Bus()

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
)

export const initialState = {
    selectedCourses: [],
    currentDate: moment(),
    courses: []
}

const searchResultsS = inputBus.flatMap((courseName) => {
    let responseP = request.get('course/course').query({name: courseName})
    return Bacon.fromPromise(responseP)
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
    })
).doLog('application state')

const searchList = (applicationState) =>
    R.pipe(R.map((c) => c.course_name),
    R.uniq,
    R.map((cname) => <div key={cname} className="search-list-coursename">{cname}</div>))(applicationState.courses)

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
                events={[]}
                defaultView="week"
                min={new Date(moment(applicationState.currentDate).hours(8).minutes(0).format())}
                max={new Date(moment(applicationState.currentDate).hours(20).minutes(0).format())}
                defaultDate={new Date(moment(applicationState.currentDate).format())}
            />
        </div>
    </div>
    </body>