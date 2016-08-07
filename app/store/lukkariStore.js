import Bacon from 'baconjs'
import {isServer} from '../utils'
import {concat, filter, isEmpty, whereEq} from 'ramda'
import {addUrlParameter, removeUrlParameter} from '../pages/browserUtils'

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

function rootReducer(previousState, action) {
  let state = previousState
  promiseMiddleware(action)
  switch (action.type) {
    case 'COURSE_INITIATE_LOAD':
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
    case 'UPDATE_URL_PARAMS':
      break
  }
  if (!isServer) {
    console.log(action.type, state)     // eslint-disable-line
  }
  return state
}

export const appState = createAppState(rootReducer, initial)
