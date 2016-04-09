import React from "react"
import {findDOMNode} from "react-dom"
import Selection, {getBoundsForNode} from "./Selection"
import cn from "classnames"
import dates from "./utils/dates"
import {isSelected} from "./utils/selection"
import localizer from "./localizer"
import {formats} from "./formats"
import {notify} from "./utils/helpers"
import {accessor} from "./utils/propTypes"
import {accessor as get} from "./utils/accessors"

function snapToSlot(date, step) {
  var roundTo = 1000 * 60 * step
  return new Date(Math.floor(date.getTime() / roundTo) * roundTo)
}

function positionFromDate(date, min, step) {
  return dates.diff(min, dates.merge(min, date), 'minutes')
}

function overlaps(event, events, {startAccessor, endAccessor}, last) {
  const eStart = get(event, startAccessor)
  let offset = last

  function overlap(eventB) {
    return dates.lt(eStart, get(eventB, endAccessor))
  }

  if (!events.length) return last - 1
  events.reverse().some(prevEvent => {
    if (overlap(prevEvent)) return true
    offset = offset - 1
  })

  return offset
}

const DaySlot = React.createClass({

  propTypes: {
    events: React.PropTypes.array.isRequired,
    step: React.PropTypes.number.isRequired,
    min: React.PropTypes.instanceOf(Date).isRequired,
    max: React.PropTypes.instanceOf(Date).isRequired,

    allDayAccessor: accessor.isRequired,
    startAccessor: accessor.isRequired,
    endAccessor: accessor.isRequired,

    selectable: React.PropTypes.bool,
    eventOffset: React.PropTypes.number,

    onSelecting: React.PropTypes.func,
    onSelectSlot: React.PropTypes.func.isRequired,
    onSelectEvent: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {selecting: false}
  },


  componentDidMount() {
    this.props.selectable
    && this._selectable()
  },

  componentWillUnmount() {
    this._teardownSelectable()
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectable && !this.props.selectable)
      this._selectable()
    if (!nextProps.selectable && this.props.selectable)
      this._teardownSelectable()
  },

  render() {
    const {
      min, max, step, start, end
      , selectRangeFormat, culture, ...props
    } = this.props

    const totalMin = dates.diff(min, max, 'minutes')
    const numSlots = Math.ceil(totalMin / step)
    const children = []

    for (var i = 0; i < numSlots; i++) {
      children.push(
        <div key={i} className='rbc-time-slot'/>
      )
    }

    this._totalMin = totalMin

    const {selecting, startSlot, endSlot} = this.state
      , style = this._slotStyle(startSlot, endSlot, 0)

    const selectDates = {
      start: this.state.startDate,
      end: this.state.endDate
    }

    return (
      <div {...props} className={cn('rbc-day-slot', props.className)}>
        { children }
        { this.renderEvents(numSlots, totalMin) }
        {
          selecting &&
          <div className='rbc-slot-selection' style={style}>
              <span>
              { localizer.format(selectDates, formats.selectRangeFormat, culture) }
              </span>
          </div>
        }
      </div>
    )
  },

  renderEvents(numSlots, totalMin) {
    const {
      events, step, min, culture, eventPropGetter
      , selected, eventTimeRangeFormat, eventComponent
      , startAccessor, endAccessor, titleAccessor
    } = this.props

    const EventComponent = eventComponent
    let lastLeftOffset = 0

    events.sort((a, b) => +get(a, startAccessor) - +get(b, startAccessor))

    return events.map((event, idx) => {
      const start = get(event, startAccessor)
      const end = get(event, endAccessor)
      const startSlot = positionFromDate(start, min, step)
      const endSlot = positionFromDate(end, min, step)

      lastLeftOffset = Math.max(0,
        overlaps(event, events.slice(0, idx), this.props, lastLeftOffset + 1))

      const style = this._slotStyle(startSlot, endSlot, lastLeftOffset)

      const title = get(event, titleAccessor)
      const label = localizer.format({start, end}, formats.eventTimeRangeFormat, culture)
      const _isSelected = isSelected(event, selected)

      if (eventPropGetter)
        var {style: xStyle, className} = eventPropGetter(event, start, end, _isSelected)

      return (
        <div
          key={'evt_' + idx}
          style={{...xStyle, ...style}}
          title={label + ': ' + title }
          onClick={this._select.bind(null, event)}
          className={cn('rbc-event', className, {
            'rbc-selected': _isSelected,
            'rbc-event-overlaps': lastLeftOffset !== 0
          })}
        >
          <div className='rbc-event-label'>{label}</div>
          <div className='rbc-event-content'>
            { EventComponent
              ? <EventComponent event={event} title={title}/>
              : title
            }
          </div>
        </div>
      )
    })
  },

  _slotStyle(startSlot, endSlot, leftOffset){

    endSlot = Math.max(endSlot, startSlot + this.props.step) //must be at least one `step` high

    const eventOffset = this.props.eventOffset || 10
      , isRtl = this.props.rtl

    const top = ((startSlot / this._totalMin) * 100)
    const bottom = ((endSlot / this._totalMin) * 100)
    const per = leftOffset === 0 ? 0 : leftOffset * eventOffset
    const rightDiff = (eventOffset / (leftOffset + 1))

    return {
      top: top + '%',
      height: bottom - top + '%',
      [isRtl ? 'right' : 'left']: per + '%',
      width: (leftOffset === 0 ? (100 - eventOffset) : (100 - per) - rightDiff) + '%'
    }
  },

  _selectable(){
    const node = findDOMNode(this)
    const selector = this._selector = new Selection(()=> findDOMNode(this))

    const maybeSelect = (box) => {
      const onSelecting = this.props.onSelecting
      const current = this.state || {}
      const state = selectionState(box)
      const {startDate: start, endDate: end} = state

      if (onSelecting) {
        if (
          (dates.eq(current.startDate, start, 'minutes') &&
          dates.eq(current.endDate, end, 'minutes')) ||
          onSelecting({start, end}) === false
        )
          return
      }

      this.setState(state)
    }

    const selectionState = ({x, y}) => {
      const {step, min, max} = this.props
      const {top, bottom} = getBoundsForNode(node)

      const mins = this._totalMin

      const range = Math.abs(top - bottom)

      let current = (y - top) / range

      current = snapToSlot(minToDate(mins * current, min), step)

      if (!this.state.selecting)
        this._initialDateSlot = current

      const initial = this._initialDateSlot

      if (dates.eq(initial, current, 'minutes'))
        current = dates.add(current, step, 'minutes')

      const start = dates.max(min, dates.min(initial, current))
      const end = dates.min(max, dates.max(initial, current))

      return {
        selecting: true,
        startDate: start,
        endDate: end,
        startSlot: positionFromDate(start, min, step),
        endSlot: positionFromDate(end, min, step)
      }
    }

    selector.on('selecting', maybeSelect)
    selector.on('selectStart', maybeSelect)

    selector
      .on('click', ({x, y}) => {
        this._clickTimer = setTimeout(()=> {
          this._selectSlot(selectionState({x, y}))
        })

        this.setState({selecting: false})
      })

    selector
      .on('select', () => {
        if (this.state.selecting) {
          this._selectSlot(this.state)
          this.setState({selecting: false})
        }
      })
  },

  _teardownSelectable() {
    if (!this._selector) return
    this._selector.teardown()
    this._selector = null
  },

  _selectSlot({startDate, endDate, endSlot, startSlot}) {
    let current = startDate
    const slots = []

    while (dates.lte(current, endDate)) {
      slots.push(current)
      current = dates.add(current, this.props.step, 'minutes')
    }

    notify(this.props.onSelectSlot, {
      slots,
      start: startDate,
      end: endDate
    })
  },

  _select(event){
    clearTimeout(this._clickTimer)
    notify(this.props.onSelectEvent, event)
  }
})


function minToDate(min, date) {
  var dt = new Date(date)
    , totalMins = dates.diff(dates.startOf(date, 'day'), date, 'minutes')

  dt = dates.hours(dt, 0)
  dt = dates.minutes(dt, totalMins + min)
  dt = dates.seconds(dt, 0)
  return dates.milliseconds(dt, 0)
}

export default DaySlot
