import React from "react"
import Bacon from "baconjs"
import BigCalendar from "react-big-calendar"
import moment from "moment"
import Promise from "bluebird"
import R from "ramda"
import Header from "../partials/header"
import searchResults from "../partials/searchResults"
import searchList from "../partials/searchList"
import CourseParser from "../util/courseParser"
const request = Promise.promisify(require('superagent'))
require('moment/locale/fi')
BigCalendar.momentLocalizer(moment)

export const pagePath = '/'
export const pageTitle = 'Lukkarimaatti'

const inputBus = new Bacon.Bus()
const selectedCoursesBus = new Bacon.Bus()
const emailBus = new Bacon.Bus()
const indexBus = new Bacon.Bus()
const ajaxBus = new Bacon.Bus()

export const initialState = (urlCourses = []) => ({
  selectedCourses: urlCourses,
  currentDate: moment(),
  courses: [],
  isSearchListVisible: false,
  urlParams: [],
  isModalOpen: false,
  selectedIndex: -1,
  waitingAjax: false
})

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
    ajaxBus.push(true)
    let responseP = request.post('api/save').send({
      email: event.address.toString(),
      link: window.location.href.toString()
    })
    return Bacon.fromPromise(responseP)
      .map((res) => {
        ajaxBus.push(false)
        return false
      })
      .mapError(true)
  }
  return event.isModalOpen
})

export const applicationStateProperty = (state) => Bacon.update(
  state,
  inputBus, (applicationState, input) => ({
    ...applicationState,
    input
  }),
  indexBus, (applicationState, selectedIndex) => ({
    ...applicationState,
    selectedIndex
  }),
  ajaxBus, (applicationState, waitingAjax) => ({
    ...applicationState,
    waitingAjax
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
)

const stringToColor = (colorSeed) => {
  var hash = 0, colour = '#', value
  colorSeed.split("").forEach(function (e) {
    hash = colorSeed.charCodeAt(e) + ((hash << 5) - hash)
  })
  for (var j = 0; j < 3; j++) {
    value = (hash >> (j * 8)) & 0xFF
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}

const Event = ({event}) => (
  <div style={{backgroundColor: stringToColor(event.title)}} className="calendar-event">
    {event.title}{event.description}
  </div>
)

export const renderPage = (applicationState) =>
  <body>
    {Header(applicationState, emailBus)}
    <div className="container">
      <a className="github-ribbon" href="https://github.com/Laastine/lukkarimaatti">
        <img style={{position: 'absolute', top: '0', right: '0', border: '0'}}
             src="github.png"
             alt="Fork me on GitHub">
        </img>
      </a>
      {searchList(applicationState, inputBus, selectedCoursesBus, indexBus)}
      <div className="selected-courses-list">
        <div className="selected-courses-list-topic">Selected courses:</div>
        {searchResults(applicationState, selectedCoursesBus, CourseParser)}
      </div>
      <div>
        <BigCalendar
          events={CourseParser.addDataToCalendar(applicationState)}
          defaultView="week"
          views={['month', 'week', 'day', 'agenda']}
          popup={false}
          formats={{dayHeaderFormat: "ddd D.M w", dayFormat: "ddd D.M", dayRangeHeaderFormat: "MMM DD.MM"}}
          components={{event: Event}}
          min={new Date(moment(applicationState.currentDate).hours(8).minutes(0).format())}
          max={new Date(moment(applicationState.currentDate).hours(20).minutes(0).format())}
          defaultDate={new Date(moment(applicationState.currentDate).format())}
        />
      </div>
      <div className="footer">
        <div id="disclaimer">Use with your own risk!</div>
        <div id="versionInfo">v1.2.5</div>
      </div>
    </div>
  </body>
