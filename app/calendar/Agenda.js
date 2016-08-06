import React, {PropTypes} from "react"
import message from "./utils/messages"
import localizer from "./localizer"
import {formats} from "./formats"
import dates from "./utils/dates"
import {navigate} from "./utils/constants"
import {accessor as get} from "./utils/accessors"
import classes from "dom-helpers/class"
import getWidth from "dom-helpers/query/width"
import scrollbarSize from "dom-helpers/util/scrollbarSize"
import {inRange} from "./utils/eventLevels"


const Agenda = React.createClass({

  propTypes: {
    messages: PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
      event: PropTypes.string
    })
  },

  getDefaultProps() {
    return {
      length: 30
    }
  },

  componentDidMount() {
    this._adjustHeader()
  },

  componentDidUpdate() {
    this._adjustHeader()
  },

  render() {
    const {length, date, startAccessor} = this.props
    let {events} = this.props
    const messages = message(this.props.messages)
    const end = dates.add(date, length, 'day')

    const range = dates.range(date, end, 'day')

    events = events.filter(event =>
      inRange(event, date, end, this.props)
    )

    events.sort((a, b) => +get(a, startAccessor) - +get(b, startAccessor))

    return (
      <div className='rbc-agenda-view'>
        <table ref='header'>
          <thead>
            <tr>
              <th className='rbc-header' ref='dateCol'>
                {messages.date}
              </th>
              <th className='rbc-header' ref='timeCol'>
                {messages.time}
              </th>
              <th className='rbc-header'>
                {messages.event}
              </th>
            </tr>
          </thead>
        </table>
        <div className='rbc-agenda-content' ref='content'>
          <table>
            <tbody ref='tbody'>
            { range.map((day, idx) => this.renderDay(day, events, idx)) }
            </tbody>
          </table>
        </div>
      </div>
    )
  },

  renderDay(day, events, dayKey){
    const {culture, components, titleAccessor} = this.props

    const EventComponent = components.event
    const DateComponent = components.date

    events = events.filter(e => inRange(e, day, day, this.props))

    return events.map((event, idx) => {
      const dateLabel = idx === 0 && localizer.format(day, formats.agendaDateFormat, culture)
      const first = idx === 0
        ? (
        <td rowSpan={events.length} className='rbc-agenda-date-cell'>
          { DateComponent
            ? <DateComponent day={day} label={dateLabel}/>
            : dateLabel
          }
        </td>
      ) : false

      const title = get(event, titleAccessor)

      return (
        <tr key={dayKey + '_' + idx}>
          {first}
          <td className='rbc-agenda-time-cell'>
            { this.timeRangeLabel(day, event) }
          </td>
          <td className='rbc-agenda-event-cell'>
            { EventComponent
              ? <EventComponent event={event} title={title}/>
              : title
            }
          </td>
        </tr>
      )
    }, [])
  },

  timeRangeLabel(day, event){
    const {
      endAccessor, startAccessor, allDayAccessor
      , culture, messages, components
    } = this.props

    let labelClass = ''
      , TimeComponent = components.time
      , label = message(messages).allDay

    const start = get(event, startAccessor)
    const end = get(event, endAccessor)

    if (!get(event, allDayAccessor)) {
      if (dates.eq(start, end, 'day')) {
        label = localizer.format({start, end}, formats.agendaTimeRangeFormat, culture)
      }
      else if (dates.eq(day, start, 'day')) {
        label = localizer.format(start, formats.agendaTimeFormat, culture)
      }
      else if (dates.eq(day, end, 'day')) {
        label = localizer.format(start, formats.agendaTimeFormat, culture)
      }
    }

    if (dates.gt(day, start, 'day')) labelClass = 'rbc-continues-prior'
    if (dates.lt(day, end, 'day'))   labelClass += ' rbc-continues-after'

    return (
      <span className={labelClass.trim()}>
        { TimeComponent
          ? <TimeComponent event={event} label={label}/>
          : label
        }
      </span>
    )
  },

  _adjustHeader() {
    const header = this.refs.header
    const firstRow = this.refs.tbody.firstChild

    if (!firstRow)
      return

    const isOverflowing = this.refs.content.scrollHeight > this.refs.content.clientHeight
    const widths = this._widths || []

    this._widths = [
      getWidth(firstRow.children[0]),
      getWidth(firstRow.children[1])
    ]

    if (widths[0] !== this._widths[0] || widths[1] !== this._widths[1]) {
      this.refs.dateCol.style.width = this._widths[0] + 'px'
      this.refs.timeCol.style.width = this._widths[1] + 'px'
    }

    if (isOverflowing) {
      classes.addClass(header, 'rbc-header-overflowing')
      header.style.marginRight = scrollbarSize() + 'px'
    }
    else {
      classes.removeClass(header, 'rbc-header-overflowing')
    }
  }
})

Agenda.navigate = (date, action)=> {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -1, 'day')

    case navigate.NEXT:
      return dates.add(date, 1, 'day')

    default:
      return date
  }
}

Agenda.range = (start, {length = Agenda.defaultProps.length}) => {
  const end = dates.add(start, length, 'day')
  return {start, end}
}

export default Agenda
