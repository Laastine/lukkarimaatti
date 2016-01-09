import React from 'react'
import R from 'ramda'

export default (applicationState, selectedCoursesBus, CourseParser) =>
    R.map((c) => {
            const courses = R.filter((cc) => cc.course_code === c.course_code, applicationState.selectedCourses)
            return <div key={c.course_code} className="search-list-element">
                <div className="result-list-coursename">{c.course_code + " - " + c.course_name}</div>
                <div className="result-list-remove" onClick={() => {
                    selectedCoursesBus.push({
                            type: 'remove',
                            courses,
                            applicationState})
                    CourseParser.removeUrlParameter(c.course_code)}}>X
                </div>
            </div>
        }, R.uniqWith(R.eqBy(R.prop('course_code')))(applicationState.selectedCourses)
    )
