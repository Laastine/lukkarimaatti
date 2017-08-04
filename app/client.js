import 'babel-polyfill'
// import React from 'react'
import ReactDOM from 'react-dom'
import UniversalRouter from 'universal-router'
import routes from './router'

const router = new UniversalRouter(routes)

function render(location) {
  router.resolve({path: location.pathname})
    .then(route => {
      document.title = route.title
      ReactDOM.render(route.component, document.body)
    })
}

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

  render(history.location)
  history.listen(location => render(location))
}
