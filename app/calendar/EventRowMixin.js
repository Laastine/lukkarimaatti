import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import EventCell from './EventCell';
import getHeight from 'dom-helpers/query/height';
import { accessor, elementType } from './utils/propTypes';
import { segStyle } from './utils/eventLevels';
import { isSelected } from './utils/selection';


export default {
  propType: {
    slots: PropTypes.number.isRequired,
    end: PropTypes.instanceOf(Date),
    start: PropTypes.instanceOf(Date),

    selected: PropTypes.array,
    eventPropGetter: PropTypes.func,
    titleAccessor: accessor,
    allDayAccessor: accessor,
    startAccessor: accessor,
    endAccessor: accessor,

    eventComponent: elementType,
    onSelect: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      segments: [],
      selected: [],
      slots: 7
    }
  },

  renderEvent(event){
    let {
        eventPropGetter, selected, start, end
      , startAccessor, endAccessor, titleAccessor
      , allDayAccessor, eventComponent, onSelect } = this.props;

    return (
      <EventCell
        event={event}
        eventPropGetter={eventPropGetter}
        onSelect={onSelect}
        selected={isSelected(event, selected)}
        startAccessor={startAccessor}
        endAccessor={endAccessor}
        titleAccessor={titleAccessor}
        allDayAccessor={allDayAccessor}
        slotStart={start}
        slotEnd={end}
        component={eventComponent}
      />
    )
  },

  renderSpan(len, key, content = ' '){
    let { slots } = this.props;

    return (
      <div key={key} className='rbc-row-segment' style={segStyle(Math.abs(len), slots)}>
        {content}
      </div>
    )
  },

  getRowHeight(){
    getHeight(findDOMNode(this))
  }
}
