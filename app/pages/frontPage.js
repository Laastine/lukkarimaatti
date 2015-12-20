import React from 'react'
import Bacon from 'baconjs'

export const renderPage = applicationState =>
  <body>
  <h1>Lukkarimaatti++</h1>
  </body>

export const initialState = {
}

export const pagePath = '/'

export const pageTitle = 'Lukkarimaatti++'

export const applicationStateProperty = initialState => Bacon.update(
  initialState
).doLog('application state')
