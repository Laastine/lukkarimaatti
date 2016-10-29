import React from 'react'
import moment from 'moment'
import {filter} from 'ramda'
import SearchList from '../../partials/SearchList'
import searchResults from '../../partials/searchResults'
import {addDataToCalendar} from '../../util/courseParser'
import {appState} from '../../store/lukkariStore'
import BigCalendar from 'react-big-calendar'  // eslint-disable-line
require('moment/locale/fi')
BigCalendar.momentLocalizer(moment)

const stringToColor = (colorSeed) => {
  let hash = 0
  let colour = '#'
  let value = null
  colorSeed.split('').forEach((e) => {
    hash = colorSeed.charCodeAt(e) + ((hash << 5) - hash)
  })
  for (let j = 0; j < 3; j++) {
    value = (hash >> (j * 8)) & 0xFF
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}

const Event = ({event}) => (
  <div style={{backgroundColor: stringToColor(event.title)}} className='calendar-event'>
    {event.title}{event.description}
  </div>
)

class Lukkari extends React.Component {
  render() {
    const {state} = this.props
    return <div>
      <div className='container'>
        <a className='github-ribbon' href='https://github.com/Laastine/lukkarimaatti'>
          <img style={{position: 'absolute', top: '0px', right: '0px', border: '0px'}}
               src='github.png'
               alt='Fork me on GitHub'>
          </img>
        </a>
        <SearchList state={state}/>
        <div className='selected-courses-list'>
          <div className='selected-courses-list-topic'>Selected courses:</div>
          {searchResults(state)}
        </div>
        <BigCalendar
          defaultView="week"
          events={addDataToCalendar(state)}
          views={['month', 'week', 'day', 'agenda']}
          popup={false}
          timeslots={2}
          components={{event: Event}}
          onSelectEvent={(c) => {
            const courses = filter((cc) => cc.course_code + '#' + cc.type === c.id, state.selectedCourses)
            appState.dispatch({type: 'REMOVE_COURSE_BY_ID', courses})
          }}
          min={new Date(moment(state.currentDate).hours(8).minutes(0).format())}
          max={new Date(moment(state.currentDate).hours(20).minutes(0).format())}
          defaultDate={new Date(moment(state.currentDate).format())}
        />
      </div>
    </div>
  }
}

export default Lukkari
