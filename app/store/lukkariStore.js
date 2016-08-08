import Bacon from 'baconjs'
import {isServer} from '../utils'
import {concat, filter, isEmpty, whereEq, uniqBy, pipe, forEach} from 'ramda'
import {addUrlParameter, removeUrlParameter, sendEmail} from '../pages/browserUtils'

const createAppState = (reducer, initialState) => {
  const bus = Bacon.Bus()
  const store = bus.scan(initialState, (state, action) => reducer(state, action))
  store.dispatch = (action) => {
    bus.push(action)
  }
  store.currentState = initialState
  store.onValue((state) => {
    store.currentState = state
  })
  return store
}

const initial = isServer ? {} : window.STATE

const promiseMiddleware = (event) => {
  if (event && event.type && event.promise) {
    const {type, promise} = event
    const SUCCESS = `${type}_SUCCESS`
    promise
      .then((data) => appState.dispatch({type: SUCCESS, data}))
  }
}

const updateUrlParams = (selectedCourses) => {
  pipe(
    uniqBy((c) => c.course_code),
    forEach((c) => addUrlParameter(c.course_code, c.group_name))
  )(selectedCourses)
}

function rootReducer(previousState, action) {
  let state = previousState   // eslint-disable-line
  promiseMiddleware(action)
  switch (action.type) {
    case 'LOAD_COURSES_BY_DEPARTMENT_SUCCESS':
      const {data, department} = action.data
      state.departmentCourses = data ? data : []
      state.department = department ? department : 'TITE'
      break
    case 'LOAD_COURSES_SUCCESS':
      if (action.data.length > 0) {
        state.selectedCourses = action.data
      } else if (state.selectedCourses.length > 0) {
        updateUrlParams(state.selectedCourses)
      }
      break
    case 'LOAD_COURSE_BY_CODE':
      state.selectedCourses = concat(state.selectedCourses, action.course)
      updateUrlParams(action.course)
      break
    case 'REMOVE_COURSE_BY_ID':
      const coursesLeft = filter((c) => c.course_id !== action.courses[0].course_id, state.selectedCourses)
      if (isEmpty(filter(whereEq({course_code: action.courses[0].course_code}), coursesLeft))) {
        removeUrlParameter(action.courses[0].course_code)
      }
      state.selectedCourses = coursesLeft
      break
    case 'REMOVE_COURSE':
      removeUrlParameter(action.course_code)
      state.selectedCourses = state.selectedCourses.filter((e) => e.course_code !== action.course_code)
      break
    case 'ADD_COURSE':
      state.selectedCourses = concat(state.selectedCourses, action.selectedCourses)
      addUrlParameter(action.selectedCourses[0].course_code, action.selectedCourses[0].group_name)
      break
    case 'SAVE_MODAL':
      state.isModalOpen = action.isModalOpen
      break
    case 'SEND_EMAIL':
      state.waitingAjax = action.waitingAjax
      sendEmail(action.email)
    case 'EMAIL_SEND_DONE':
      state.waitingAjax = action.waitingAjax
      state.isModalOpen = false
      break
    case 'EMAIL_SEND_FAILED':
      state.waitingAjax = action.waitingAjax
      state.isModalOpen = false
      break
  }
  if (!isServer) {
    console.log(action.type, state)     // eslint-disable-line
  }
  return state
}

export const appState = createAppState(rootReducer, initial)