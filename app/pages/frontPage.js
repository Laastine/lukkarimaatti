import React from 'react'
import Bacon from 'baconjs'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import Promise from 'bluebird'
const request = Promise.promisify(require('superagent'))

const dayBus = new Bacon.Bus()
const inputBus = new Bacon.Bus()

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
)

export const renderPage = applicationState =>
    <body>
    <div className="container">
        <div className="search-container">
            <input id="course-searchbox" onKeyUp={(event) => inputBus.push(event.target.value)}></input>
        </div>
        <div>
            <BigCalendar
                events={[]}
                defaultView="week"
                min={new Date(2015, 11, 17, 8, 0, 0)}
                max={new Date(2015, 11, 17, 20, 0, 0)}
                defaultDate={new Date()}
            />
        </div>
    </div>
    </body>

inputBus.onValue((nameVal) => {
    request.get('course/course').query({ name: nameVal }).end((err, res) => console.log('res',res))
})


export const initialState = {}

export const pagePath = '/'

export const pageTitle = 'Lukkarimaatti++'

export const applicationStateProperty = initialState => Bacon.update(
    initialState,
    inputBus, (applicationState, input) => ({
        ...applicationState,
        input
    })
)
.doLog('application state')
