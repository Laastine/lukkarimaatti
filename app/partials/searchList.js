import React from 'react'
import R from 'ramda'

export default (applicationState, inputBus, selectedCoursesBus) => {
    const searchList = applicationState.isSearchListVisible ?
        R.pipe(
            R.uniqBy((c) => c.course_name),
            R.map((c) =>
                <div key={c.course_name}
                     className="search-list-coursename"
                     onClick={(e) => {
                     applicationState.isSearchListVisible = false
                     selectedCoursesBus.push({
                        type: 'add',
                        courses: R.filter(function(c) {return c.course_name === e.target.textContent}, applicationState.courses),
                        applicationState})
                     e.target.parentElement.parentElement.firstElementChild.firstElementChild.value = ""
                     }}>{c.course_name}</div>))(applicationState.courses) : undefined

    return (
        <div>
            <div className="search-container">
                <input id="course-searchbox" autoFocus placeholder="Course name"
                       onKeyUp={(event) => inputBus.push(event.target.value)}></input>
            </div>
            < div
                className="search-list-container">
                {searchList}
            </div>
        </div>
    )
}

