import dates from './utils/dates'

function inSame12Hr(start, end) {
  const s = 12 - dates.hours(start)
  const e = 12 - dates.hours(end)
  return (s <= 0 && e <= 0) || (s >= 0 && e >= 0)
}

const dateRangeFormat = ({start, end}, culture, local)=>
local.format(start, 'd', culture) + ' — ' + local.format(end, 'd', culture)

const timeRangeFormat = ({start, end}, culture, local)=>
local.format(start, 'h:mmtt', culture) +
' — ' + local.format(end, inSame12Hr(start, end) ? 'h:mm' : 'h:mmtt', culture)

const weekRangeFormat = ({start, end}, culture, local)=>
local.format(start, 'MMM dd', culture) +
' - ' + local.format(end, dates.eq(start, end, 'month') ? 'dd' : 'MMM dd', culture)

export const formats = {

  dateFormat: 'dd.mm',
  dayFormat: 'ddd dd.MM',
  weekdayFormat: 'ddd',

  selectRangeFormat: timeRangeFormat,
  eventTimeRangeFormat: timeRangeFormat,

  timeGutterFormat: 'h:mm',

  monthHeaderFormat: 'MMMM yyyy',
  dayHeaderFormat: 'dddd MMM dd',
  dayRangeHeaderFormat: weekRangeFormat,
  agendaHeaderFormat: dateRangeFormat,

  agendaDateFormat: 'ddd MMM dd',
  agendaTimeFormat: 'hh:mm tt',
  agendaTimeRangeFormat: timeRangeFormat
}

export function set(_formats) {
  if (arguments.length > 1)
    _formats = {[_formats]: arguments[1]}

  Object.assign(formats, _formats)
}

export default function format(fmts) {
  return {
    ...formats,
    ...fmts
  }
}
