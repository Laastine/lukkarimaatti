import React from 'react'
import {Link} from 'react-router'
import {any} from 'ramda'

const DepartmentSelectorElement = (selectedDepartment) => {
  const departmentNames = ['ENTE-YMTE',
    'KETE',
    'KATI',
    'KIKE',
    'KOTE',
    'MAFY',
    'SATE',
    'TITE',
    'TUTA']
    .map((e, index) => {
      return <span key={`${index}-${e}`}>
        <Link className={`department-link${selectedDepartment === e ? '-selected' : ''}`}
              to={`/catalog/${e}`}>{e}</Link>
      </span>
    })

  return <div className="deparment-link-container">{departmentNames}</div>
}

const getSemester = (week) => {
  const endingWeekOfJune = 26
  return any((w) => Number(w) > endingWeekOfJune, week.split(',')) ? 'Autumn' : 'Spring'
}

const isSelected = (state, courseCode) => {
  return any((c) => c.course_code === courseCode, state.selectedCourses)
}

const DepartmentCoursesElement = (state) => {
  const courses = state.departmentCourses.map((c) => {
    const selected = isSelected(state, c.course_code)
    return <div key={c.course_code + c.course_name}
                className={`department-course${selected ? '-selected' : ''}`}>{c.course_code}
      - {c.course_name}: {getSemester(c.week)} {selected ? 'SELECTED': null}
    </div>
  })
  return <div>{courses}</div>
}

class Catalog extends React.Component {
  render() {
    const {state} = this.props
    return <div>
      {DepartmentSelectorElement(state.department)}
      {DepartmentCoursesElement(state)}
    </div>
  }
}

export default Catalog
