import React from 'react'
import PropTypes from 'prop-types'
import {onLinkClick} from '../../routes'
import {appState} from '../../store/lukkariStore'
import {loadCourseByCode} from '../frontApi/lukkariApi'
import {any, isEmpty, merge, partial} from 'ramda'

const courseDisplayModes = {
  AUTUMN: 'AUTUMN',
  SPRING: 'SPRING',
  ALL: 'ALL'
}

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
    .map((e, index) => <div key={`${index}-${e}`}>
      <a className={`department-link${selectedDepartment === e ? '-selected' : ''}`}
        href={`/catalog/${e}`} onClick={onLinkClick}>{e}
      </a>
    </div>)

  return <div className="department-link-container">{departmentNames}</div>
}

const VisualizationOptions = (selectedVisualizationMode, cb) => {
  const displayModes = Object.keys(courseDisplayModes)
    .map((e, index) => <div key={`${index}-${e}`}>
      <a className={`department-link${selectedVisualizationMode === e ? '-selected' : ''}`} onClick={() => cb(e)}>{e}
      </a>
    </div>)

  return <div className="department-link-container">{displayModes}</div>
}

const getSemester = (week) => {
  const endingWeekOfJune = 26
  return any((w) => Number(w) > endingWeekOfJune, week.split(',')) ? 'Autumn' : 'Spring'
}

const isSelected = (state, courseCode, groupName) => {
  const groupNameExists = !isEmpty(state.selectedCourses
    .filter((c) => c.course_code === courseCode && c.group_name === groupName))
  return groupNameExists && any((c) => c.course_code === courseCode, state.selectedCourses)
}

const selectCourse = courseCode => {
  loadCourseByCode(courseCode)
    .then((course) => {
      appState.dispatch({type: 'LOAD_COURSE_BY_CODE', course})
    })
}

const removeCourse = (courseCode) => {
  appState.dispatch({type: 'REMOVE_COURSE', course_code: courseCode})
}

const courseSelect = (c, isCourseSelected) => {
  if (isCourseSelected) {
    removeCourse(c.course_code, c.group_name)
  } else {
    selectCourse(c.course_code)
  }
}

const DepartmentCoursesElement = (state) => {
  const courses = state.departmentCourses ? state.departmentCourses
    .filter(c => state.whichCoursesToDisplay === courseDisplayModes.ALL ||
        getSemester(c.week).toUpperCase() === state.whichCoursesToDisplay)
    .sort((a, b) => {
      if (a.course_name > b.course_name) {
        return 1
      } else if (a.course_name < b.course_name) {
        return -1
      } else {
        return 0
      }
    })
    .map((c, idx) => {
      const selected = isSelected(state, c.course_code, c.group_name)
      return <li key={c.course_code + c.course_name} className={`department-course${selected ? ' selected' : ''}`} onClick={partial(courseSelect, [c, selected])}>
        <label className='control control--checkbox' htmlFor={`course-box${idx}`}>
          <input id={`course-box${idx}`} className='department-course-checkbox' type='checkbox' checked={selected} readOnly></input>
          <div className="control__indicator"></div>
        </label>
        <div className='department-course-element'>{c.course_code} - {c.course_name}: {getSemester(c.week)}</div>
      </li>
    }) : null
  return <ul className='department-course-list'>{courses}</ul>
}

class Catalog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      whichCoursesToDisplay: courseDisplayModes.ALL
    }
  }

  visisualizationSelectCb = (whichCoursesToDisplay) => {
    this.setState(() => ({whichCoursesToDisplay}))
  }

  render() {
    return <div>
      {DepartmentSelectorElement(this.props.state.department)}
      {VisualizationOptions(this.state.whichCoursesToDisplay, this.visisualizationSelectCb)}
      {DepartmentCoursesElement(merge(this.state, this.props.state))}
    </div>
  }
}

Catalog.displayName = 'Catalog'

Catalog.propTypes = {
  state: PropTypes.shape({
    selected: PropTypes.bool,
    departmentCourses: PropTypes.array,
    department: PropTypes.string
  })
}

export default Catalog
