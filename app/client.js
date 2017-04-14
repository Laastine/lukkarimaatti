import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom'
import {match, browserHistory} from 'react-router'
import Routes from './pages/routes'
import App from './pages/app'

window.onload = () => {
  window.onerror = function(message, file, line, col, error) {
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
      error: {message: message, file: file, line: line, col: col, error: serializeError(error)},
      userAgent: window.navigator.userAgent
    })
    return false
  }

  match({routes: Routes, history: browserHistory}, (error, redirectLocation, renderProps) => {
    render(<App renderProps={renderProps}></App>, document.getElementById('root'))
  })
}
