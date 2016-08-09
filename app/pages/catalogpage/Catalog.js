import React from 'react'
import {Link} from 'react-router'
import {appState} from '../../store/lukkariStore'
import {loadCourseByCodeAndGroup, loadCourseByCode} from '../frontApi/lukkariApi'
import {any, partial} from 'ramda'

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

  return <div className="department-link-container">{departmentNames}</div>
}

const getSemester = (week) => {
  const endingWeekOfJune = 26
  return any((w) => Number(w) > endingWeekOfJune, week.split(',')) ? 'Autumn' : 'Spring'
}

const isSelected = (state, courseCode) => {
  const groupName = state.selectedCourses.filter((c) => c.course_code === courseCode).map((c) => c.group_name)[0]
  return any((c) => c.course_code === courseCode && c.group_name === groupName, state.selectedCourses)
}

const selectCourse = (courseCode, groupName) => {
  if (courseCode.substring(0, 2) === 'FV') {
    loadCourseByCodeAndGroup(courseCode, groupName)
      .then((course) => {
        appState.dispatch({type: 'LOAD_COURSE_BY_CODE', course})
      })
  } else {
    loadCourseByCode(courseCode)
      .then((course) => {
        appState.dispatch({type: 'LOAD_COURSE_BY_CODE', course})
      })
  }
}

const DepartmentCoursesElement = (state) => {
  const courses = state.departmentCourses ? state.departmentCourses.map((c) => {
    const selected = isSelected(state, c.course_code)
    return <li key={c.course_code + c.course_name}
               className={`department-course${selected ? '-selected' : ''}`}
               onClick={partial(selectCourse, [c.course_code, c.group_name])}>
      {c.course_code} - {c.course_name}: {getSemester(c.week)} {selected ? 'SELECTED' : null}
    </li>
  }) : null
  return <ul className='department-course-list'>{courses}</ul>
}

class Catalog extends React.Component {
  render() {
    return <div>
      {DepartmentSelectorElement(this.props.state.department)}
      {DepartmentCoursesElement(this.props.state)}
    </div>
  }
}

export default Catalog
