import React from "react"
import {map, uniqWith, eqBy, prop, filter} from "ramda"

export default (applicationState, selectedCoursesBus, CourseParser) =>
  map((c) => {
    const courses = filter((cc) => cc.course_code === c.course_code, applicationState.selectedCourses)
    return <div key={c.course_code} className="search-list-element">
      <div className="result-list-coursename">{c.course_code + " - " + c.course_name}</div>
      <div className="result-list-remove" onClick={() => {
        selectedCoursesBus.push({type: 'remove', courses, applicationState})
        CourseParser.removeUrlParameter(c.course_code)}}>X
      </div>
    </div>
  }, uniqWith(eqBy(prop('course_code')))(applicationState.selectedCourses)
  )
