import React from 'react'
import Bacon from 'baconjs'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'


BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
)

export const renderPage = applicationState =>
  <body>
  <h1>Lukkarimaatti++</h1>
  <div>
    <BigCalendar
      events={[]}
      defaultDate={new Date()}
    />
  </div>
  </body>

export const initialState = {
}

export const pagePath = '/'

export const pageTitle = 'Lukkarimaatti++'

export const applicationStateProperty = initialState => Bacon.update(
  initialState
).doLog('application state')
