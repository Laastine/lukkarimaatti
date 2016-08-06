import React from "react"
import {map, uniqWith, eqBy, prop} from "ramda"
import {appState} from "../store/lukkariStore"

export default (state) => map((c) => <div key={c.course_code} className="search-list-element">
    <div className="result-list-coursename">{c.course_code + " - " + c.course_name}</div>
    <div className="result-list-remove" onClick={() => {
      appState.dispatch({type: 'REMOVE_COURSE', course: c.course_code})
    }}>X
    </div>
  </div>, uniqWith(eqBy(prop('course_code')))(state.selectedCourses)
)
