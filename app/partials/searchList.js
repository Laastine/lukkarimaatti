import React from 'react'
import R from 'ramda'

const addCourse = (courseName, applicationState, selectedCoursesBus) => {
    applicationState.isSearchListVisible = false
    selectedCoursesBus.push({
        type: 'add',
        courses: R.filter(function (c) {
            return c.course_name === courseName//foo[selectedIndex].course_name
        }, applicationState.courses),
        applicationState
    })
}

export default (applicationState, inputBus, selectedCoursesBus, indexBus) => {

    const handleKeyInput = (event) => {
        const foo = R.pipe(R.uniqBy((c) => c.course_name), R.slice(0, 10))(applicationState.courses)
        if (event.keyCode === 40) {  //Down
            if (applicationState.selectedIndex < foo.length - 1 && applicationState.selectedIndex < 10) {
                indexBus.push(++applicationState.selectedIndex)
            }
        } else if (event.keyCode === 38) {  //Up
            if (applicationState.selectedIndex > 1) {
                indexBus.push(--applicationState.selectedIndex)
            }
        } else if (event.keyCode === 13) {  //Enter
            addCourse(foo[applicationState.selectedIndex].course_name, applicationState, selectedCoursesBus)
            document.getElementById('course-searchbox').value = ""
        } else {
            indexBus.push(-1)
        }
    }

    const selectCourse = (event) => {
        addCourse(event.target.textContent, applicationState, selectedCoursesBus)
        event.target.parentElement.parentElement.firstElementChild.firstElementChild.value = ""
    }

    const searchList = () => {
        const mapIndexed = R.addIndex(R.map)
        return applicationState.isSearchListVisible ?
            R.pipe(
                R.uniqBy((c) => c.course_name),
                R.slice(0, 10),
                mapIndexed((c, index) =>
                    <div key={c.course_name}
                         onMouseEnter={() => indexBus.push(index)}
                         className={index === applicationState.selectedIndex ? "search-list-coursename search-list-selected" : "search-list-coursename"}
                         onClick={selectCourse}>{c.course_name}</div>))(applicationState.courses) : undefined
    }

    return (
        <div>
            <div className="search-container">
                <input id="course-searchbox" autoFocus placeholder="Course name"
                       onKeyUp={(event) => {inputBus.push(event.target.value)}}
                       onKeyDown={handleKeyInput}></input>
            </div>
            <div className="search-list-container"
                 onMouseLeave={() => indexBus.push(-1)}>
                {searchList()}
            </div>
        </div>
    )
}

