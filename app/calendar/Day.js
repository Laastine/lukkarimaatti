import React from 'react'
import dates from './utils/dates'
import TimeGrid from './TimeGrid'
import {navigate} from './utils/constants'

const Day = React.createClass({

  propTypes: TimeGrid.propTypes,

  render() {
    const {date} = this.props
    const {start, end} = Day.range(date)

    return (
      <TimeGrid {...this.props} start={start} end={end} eventOffset={10}/>
    )
  }
})

Day.navigate = (date, action)=> {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -1, 'day')

    case navigate.NEXT:
      return dates.add(date, 1, 'day')

    default:
      return date
  }
}


Day.range = (date)=> {
  date = dates.startOf(date, 'day')
  return {start: date, end: date}
}


export default Day
