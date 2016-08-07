import React from 'react'
import dates from './utils/dates'
import localizer from './localizer'
import {navigate} from './utils/constants'
import TimeGrid from './TimeGrid'

const Week = React.createClass({

  propTypes: TimeGrid.propTypes,

  render() {
    const {date} = this.props
    const {start, end} = Week.range(date, this.props)

    return (
      <TimeGrid {...this.props} start={start} end={end} eventOffset={15}/>
    )
  }

})

Week.navigate = (date, action)=> {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -1, 'week')

    case navigate.NEXT:
      return dates.add(date, 1, 'week')

    default:
      return date
  }
}

Week.range = (date, {culture}) => {
  const firstOfWeek = localizer.startOfWeek(culture)
  const start = dates.startOf(date, 'week', firstOfWeek)
  const end = dates.endOf(date, 'week', firstOfWeek)

  return {start, end}
}


export default Week
