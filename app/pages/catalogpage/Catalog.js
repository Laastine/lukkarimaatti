import React from 'react'
import {Link} from 'react-router'

const DepartmentSelectorElement = (selectedDepartment) => {
  const departmentNames = ['ENTE-YMTE',
    'KETE',
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

const DepartmentCoursesElement = (state) => {
  const courses = state.departmentCourses.map((c) =>
      <div key={c.course_code + c.course_name}
           className="department-course">{c.course_code} - {c.course_name}: {c.week}
      </div>)
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
