import React from 'react'
import {Link} from 'react-router'
import {pipe, uniqBy, map} from 'ramda'

const DepartmentSelectorElement = () =>
  ['ENTE-YMTE',
    'KETE',
    'KIKE',
    'KOTE',
    'MAFY',
    'SATE',
    'TITE',
    'TUTA']
    .map((e, index) => {
      return <div key={`${index}-${e}`} className='department-link'>
        <Link to={`/catalog/${e}`}>{e}</Link>
      </div>
    })

const DepartmentCoursesElement = (state) => {
  const courses = pipe(
    uniqBy((c) => c.course_name),
    map((c) => <div key={c.course_code+c.course_name}
                    className="department-course">{c.course_code} - {c.course_name}</div>))(state.departmentCourses)
  return <div>{courses}</div>
}

class Catalog extends React.Component {
  render() {
    const {state} = this.props
    return <div>
      {DepartmentSelectorElement()}
      {DepartmentCoursesElement(state)}
    </div>
  }
}

export default Catalog
