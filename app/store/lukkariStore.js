import Bacon from 'baconjs'
import {isServer} from '../utils'

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
      break
    case 'REMOVE_COURSE':
      break
    case 'ADD_COURSE':
      break
    case 'UPDATE_URL_PARAMS':
      break
  }
  if (true) {
    console.log(action.type, state)     // eslint-disable-line
  }
  return state
}

export const appState = createAppState(rootReducer, initial)
