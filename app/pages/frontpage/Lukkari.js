import React from 'react'
import BigCalendar from '../../calendar/index'
import moment from 'moment'
import {filter} from 'ramda'
import searchResults from '../../partials/searchResults'
import SearchList from '../../partials/searchList'
import {addDataToCalendar} from '../../util/courseParser'
import {appState} from '../../store/lukkariStore'  // eslint-disable-line

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

const Calendar = (state) =>
  <BigCalendar
    events={addDataToCalendar(state)}
    views={['month', 'week', 'day', 'agenda']}
    popup={false}
    components={{event: Event}}
    onSelectEvent={(c) => {
      const courses = filter((cc) => cc.course_code + '#' + cc.type === c.id, state.selectedCourses)
      appState.dispatch({type: 'REMOVE_COURSE_BY_ID', courses})
    }}
    min={new Date(moment(state.currentDate).hours(8).minutes(0).format())}
    max={new Date(moment(state.currentDate).hours(20).minutes(0).format())}
    defaultDate={new Date(moment(state.currentDate).format())}
  />

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
        <div>
          {Calendar(state)}
        </div>
      </div>
    </div>
  }
}

export default Lukkari
