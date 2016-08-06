import React from "react"
import BigCalendar from "../../calendar/index"
import moment from "moment"
import {filter} from "ramda"
import Header from "../../partials/header"
import searchResults from "../../partials/searchResults"
import SearchList from "../../partials/searchList"
import {addDataToCalendar} from "../../util/courseParser"

require('moment/locale/fi')
BigCalendar.momentLocalizer(moment)

const stringToColor = (colorSeed) => {
  var hash = 0, colour = '#', value
  colorSeed.split("").forEach(function (e) {
    hash = colorSeed.charCodeAt(e) + ((hash << 5) - hash)
  })
  for (var j = 0; j < 3; j++) {
    value = (hash >> (j * 8)) & 0xFF
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}

const Event = ({event}) => (
  <div style={{backgroundColor: stringToColor(event.title)}} className="calendar-event">
    {event.title}{event.description}
  </div>
)

const Calendar = (applicationState) =>
  <BigCalendar
    events={addDataToCalendar(applicationState)}
    views={['month', 'week', 'day', 'agenda']}
    popup={false}
    components={{event: Event}}
    onSelectEvent={(c) => {
      const courses = filter((cc) => cc.course_code + "#" + cc.type === c.id, applicationState.selectedCourses)
      console.log('NOT IMPLEMENTED', courses)
    }}
    min={new Date(moment(applicationState.currentDate).hours(8).minutes(0).format())}
    max={new Date(moment(applicationState.currentDate).hours(20).minutes(0).format())}
    defaultDate={new Date(moment(applicationState.currentDate).format())}
  />

class Lukkari extends React.Component {
  render() {
    const {state} = this.props
    return <div>
      {Header(state)}
      <div className="container">
        <a className="github-ribbon" href="https://github.com/Laastine/lukkarimaatti">
          <img style={{position: 'absolute', top: '0px', right: '0px', border: '0px'}}
               src="github.png"
               alt="Fork me on GitHub">
          </img>
        </a>
        <SearchList state={state}/>
        <div className="selected-courses-list">
          <div className="selected-courses-list-topic">Selected courses:</div>
          {searchResults(state)}
        </div>
        <div>
          {Calendar(state)}
        </div>
        <div className="footer">
          <div id="disclaimer">Use with your own risk!</div>
          <div id="versionInfo">v1.2.8</div>
        </div>
      </div>
    </div>
  }
}

export default Lukkari
