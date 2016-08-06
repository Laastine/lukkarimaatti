import React from "react"
import {filter, pipe, uniqBy, addIndex, map, slice, partial} from "ramda"
import axios from "axios"
import Bacon from "baconjs"

const addCourse = (courseName, state) => {
  state.isSearchListVisible = false
  selectedCoursesBus.push({
    type: 'add',
    courses: filter(function (c) {
      return c.course_name === courseName//foo[selectedIndex].course_name
    }, state.courses),
    state
  })
}


const handleKeyInput = (event, state) => {
  const foo = pipe(uniqBy((c) => c.course_name), slice(0, 10))(state.courses)
  if (event.keyCode === 40) {  //Down
    if (state.selectedIndex < foo.length - 1 && state.selectedIndex < 10) {
      this.setState({selectedIndex: this.state.selectedIndex + 1})
    }
  } else if (event.keyCode === 38) {  //Up
    if (state.selectedIndex > 1) {
      this.setState({selectedIndex: this.state.selectedIndex - 1})
    }
  } else if (event.keyCode === 13) {  //Enter
    addCourse(foo[state.selectedIndex].course_name, state)
    document.getElementById('course-searchbox').value = ""
  } else {
    this.setState({selectedIndex: -1})
  }
}

const selectCourse = (event, state) => {
  addCourse(event.target.textContent, state)
  event.target.parentElement.parentElement.firstElementChild.firstElementChild.value = ""
}

const searchList = (state) => {
  const mapIndexed = addIndex(map)
  return state && state.searchResults && state.searchResults.length > 0 ?
    pipe(
      uniqBy((c) => {
        return c.course_name}),
      slice(0, 10),
      mapIndexed((c, index) =>
        <div key={c.course_name}
             onMouseEnter={() => {
               console.log('mouse enter')
             }}
             className={index === state.selectedIndex ? "search-list-coursename search-list-selected" : "search-list-coursename"}
             onClick={partial(selectCourse, [state])}>{c.course_name}</div>))(state.searchResults) : undefined
}

class SearchList extends React.Component {
  initialState() {
    return {
      selectedIndex: -1,
      searchString: '',
      searchResults: []
    }
  }

  componentDidMount() {
    document.getElementsByClassName('search-container')[0].focus()
    Bacon.fromEventTarget(this.refs.searchinput, 'keyup')
      .debounce(200)
      .onValue((e) => {
        if (e.target.value.length > 0) {
          axios.get('/course/course', {
            params: {
              name: e.target.value
            }
          })
            .then((res) => {
              this.setState({searchResults: res.data})
            })
        }
      })
  }

  render() {
    const state = this.state
    return <div>
      <div className="search-container">
        <input id="course-searchbox" autoFocus placeholder="Course name"
               ref='searchinput'
               onKeyDown={(event) => {
                 partial(handleKeyInput, [event, state])
               }}></input>
      </div>
      <div className="search-list-container"
           onMouseLeave={() => {
             this.setState({selectedIndex: -1})
           }}>
        {searchList(state)}
      </div>
    </div>
  }
}

export default SearchList
