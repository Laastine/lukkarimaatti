import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom'
import {match, browserHistory} from 'react-router'
import Routes from './pages/routes'
import App from './pages/app'

window.onload = () => {
  browserHistory.listen(() => {
  })

  match({routes: Routes, history: browserHistory}, (error, redirectLocation, renderProps) => {
    render(<App renderProps={renderProps}></App>, document.getElementById('root'))
  })
}
