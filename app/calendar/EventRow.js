import React from "react"
import EventRowMixin from "./EventRowMixin"


const EventRow = React.createClass({

  displayName: 'EventRow',

  propTypes: {
    segments: React.PropTypes.array
  },

  mixins: [EventRowMixin],

  render(){
    const {segments} = this.props

    let lastEnd = 1

    return (
      <div className='rbc-row'>
        {
          segments.reduce((row, {event, left, right, span}, li) => {
            const key = '_lvl_' + li
            const gap = left - lastEnd

            const content = this.renderEvent(event)

            if (gap)
              row.push(this.renderSpan(gap, key + '_gap'))

            row.push(
              this.renderSpan(span, key, content)
            )

            lastEnd = (right + 1)

            return row
          }, [])
        }
      </div>
    )
  }
})

export default EventRow
