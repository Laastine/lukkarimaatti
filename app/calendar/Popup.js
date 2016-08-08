import React from 'react'
import EventCell from './EventCell'
import {isSelected} from './utils/selection'
import localizer from './localizer'
import {formats} from './formats'
import getOffset from 'dom-helpers/query/offset'
import getScrollTop from 'dom-helpers/query/scrollTop'
import getScrollLeft from 'dom-helpers/query/scrollLeft'

class Popup extends React.Component {

  componentDidMount() {
    const {popupOffset = 5} = this.props
      , {top, left, width, height} = getOffset(this.refs.root)
      , viewBottom = window.innerHeight + getScrollTop(window)
      , viewRight = window.innerWidth + getScrollLeft(window)
      , bottom = top + height
      , right = left + width

    if (bottom > viewBottom || right > viewRight) {
      let topOffset, leftOffset

      if (bottom > viewBottom)
        topOffset = bottom - viewBottom + (popupOffset.y || +popupOffset || 0)
      if (right > viewRight)
        leftOffset = right - viewRight + (popupOffset.x || +popupOffset || 0)

      this.setState({topOffset, leftOffset}) //eslint-disable-line
    }
  }

  render() {
    const {events, selected, eventComponent, ...props} = this.props

    const {left, width, top} = this.props.position
      , topOffset = (this.state || {}).topOffset || 0
      , leftOffset = (this.state || {}).leftOffset || 0

    const style = {
      top: top - topOffset,
      left: left - leftOffset,
      minWidth: width + (width / 2)
    }

    return (
      <div ref='root' style={style} className='rbc-overlay'>
        <div className='rbc-overlay-header'>
          { localizer.format(props.slotStart, formats.dayHeaderFormat, props.culture) }
        </div>
        {
          events.map((event, idx) =>
            <EventCell key={idx}
              {...props}
                       event={event}
                       component={eventComponent}
                       selected={isSelected(event, selected)}
            />
          )
        }
      </div>
    )
  }
}

export default Popup
