import React from "react"
import EventRowMixin from "./EventRowMixin"
import {eventLevels} from "./utils/eventLevels"
import message from "./utils/messages"
import {range} from "ramda"

const isSegmentInSlot = (seg, slot) => seg.left <= slot && seg.right >= slot
const eventsInSlot = (segments, slot) => segments.filter(seg => isSegmentInSlot(seg, slot)).length

const EventRow = React.createClass({

  displayName: 'EventRow',

  propTypes: {
    segments: React.PropTypes.array,
    slots: React.PropTypes.number
  },

  mixins: [EventRowMixin],

  render(){
    const {segments, slots: slotCount} = this.props
    const rowSegments = eventLevels(segments).levels[0]

    let current = 1
    let lastEnd = 1
    const row = []

    while (current <= slotCount) {
      const key = '_lvl_' + current

      const {event, left, right, span} = rowSegments
        .filter(seg => isSegmentInSlot(seg, current))[0] || {} //eslint-disable-line

      if (!event) {
        current++
        continue
      }

      const gap = Math.max(0, left - lastEnd)

      if (this.canRenderSlotEvent(left, span)) {
        const content = this.renderEvent(event)

        if (gap)
          row.push(this.renderSpan(gap, key + '_gap'))

        row.push(
          this.renderSpan(span, key, content)
        )

        lastEnd = current = (right + 1)
      }
      else {
        if (gap)
          row.push(this.renderSpan(gap, key + '_gap'))

        row.push(this.renderSpan(1, key, this.renderShowMore(segments, current)))
        lastEnd = current = current + 1
      }
    }

    return (
      <div className='rbc-row'>
        { row }
      </div>
    )
  },

  canRenderSlotEvent(slot, span){
    const {segments} = this.props

    return range(slot, slot + span).every(s => {
      const count = eventsInSlot(segments, s)

      return count === 1
    })
  },

  renderShowMore(segments, slot) {
    const messages = message(this.props.messages)
    const count = eventsInSlot(segments, slot)

    return count
      ? (
      <a
        key={'sm_' + slot}
        href='#'
        className={'rbc-show-more'}
        onClick={this._showMore.bind(null, slot)}
      >
        {messages.showMore(count)}
      </a>
    ) : false
  },

  _showMore(slot, e){
    e.preventDefault()
    this.props.onShowMore(slot)
  }
})

export default EventRow
