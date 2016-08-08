import React from 'react'
import cn from 'classnames'
import dates from './utils/dates'
import localizer from './localizer'
import {formats} from './formats'

const TimeGutter = React.createClass({

  propTypes: {
    step: React.PropTypes.number.isRequired,
    min: React.PropTypes.instanceOf(Date).isRequired,
    max: React.PropTypes.instanceOf(Date).isRequired
  },

  render() {
    const {min, max, step, culture} = this.props
    const today = new Date()
    const totalMin = dates.diff(min, max, 'minutes')
    const numSlots = Math.ceil(totalMin / step)
    const children = [] //<div key={-1} className='rbc-time-slot rbc-day-header'>&nbsp</div>
    let date = min

    for (let i = 0; i < numSlots; i++) {
      const isEven = (i % 2) === 0
      const next = dates.add(date, step, 'minutes')
      children.push(
        <div key={i}
             className={cn('rbc-time-slot', {
               'rbc-now': dates.inRange(today, date, next, 'minutes')
             })}
        >
          { isEven && (
            <span>{localizer.format(date, formats.timeGutterFormat, culture)}</span>
          )
          }
        </div>
      )

      date = next
    }

    return (
      <div className='rbc-time-gutter'>
        {children}
      </div>
    )
  }
})

export default TimeGutter
