import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import UniversalRouter from 'universal-router'
import QueryString from 'query-string'
import {routes} from './router'
import App from './pages/app'
import history from './history'

window.onload = () => {
  window.onerror = function (message, file, line, col, error) {
    function serializeError(object) {
      const alt = {}
      if (object) {
        Object.getOwnPropertyNames(object).forEach((key) => {
          alt[key] = object[key]
        }, object)
      }
      return alt
    }

    function sendMessageToServer(msg) {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/errors')
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(JSON.stringify(msg))
    }

    sendMessageToServer({
      error: {message, file, line, col, error: serializeError(error)},
      userAgent: window.navigator.userAgent
    })
    return false
  }
}

const router = new UniversalRouter(routes)

function render(location) {
  router.resolve({
    path: location.pathname,
    query: QueryString.parse(window.location.search)
  })
    .then(route => {
      ReactDOM.render(<App component={route.component}/>, document.getElementById('root'))
    })
}

render(history.location)
history.listen(() => render)
