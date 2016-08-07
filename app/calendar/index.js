import Calendar from './Calendar'
import {set as setLocalizer} from './localizer'
import momentLocalizer from './localizers/moment'
import viewLabel from './utils/viewLabel'
import move from './utils/move'
import {views} from './utils/constants'

Object.assign(Calendar, {
  setLocalizer,
  momentLocalizer,
  label: viewLabel,
  views,
  move
})

export default Calendar
