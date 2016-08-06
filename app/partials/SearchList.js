import React from "react"
import {pipe, uniqBy, contains, addIndex, map, slice, partial} from "ramda"
import axios from "axios"
import Bacon from "baconjs"
import {appState} from "../store/lukkariStore"

const LIST_MAX_LEN = 10

const selectedCourse = (state) => pipe(uniqBy((c) => c.course_name), slice(0, LIST_MAX_LEN))(state && state.searchResults ? state.searchResults : [])

const handleKeyInput = (event, state, indexCallback) => {
  if (event.keyCode === 40) {  //Down
    if (state.selectedIndex < selectedCourse.length - 1 && state.selectedIndex < LIST_MAX_LEN) {
      indexCallback(state.selectedIndex + 1)
    }
  } else if (event.keyCode === 38) {  //Up
    if (state.selectedIndex > 0) {
      indexCallback(state.selectedIndex - 1)
    }
  } else if (event.keyCode === 13) {  //Enter
    appState.dispatch({type: 'ADD_COURSE', selectedCourse: selectedCourse(state)})
    document.getElementById('course-searchbox').value = ''
  } else {
    indexCallback(-1)
  }
}

const selectCourse = (event, state) => {
  appState.dispatch({type: 'ADD_COURSE', selectedCourse: selectedCourse(state)})
  event.target.parentElement.parentElement.firstElementChild.firstElementChild.value = ""
}

const searchList = (state, isSearchListVisible, mouseEnterCallback) => {
  const mapIndexed = addIndex(map)
  return state && state.searchResults && state.searchString
  && state.searchResults.length > 0 && state.searchString.length > 0 ?
    pipe(
      uniqBy((c) => c.course_name),
      slice(0, LIST_MAX_LEN),
      mapIndexed((c, index) =>
        <div key={c.course_name}
             onMouseEnter={partial(mouseEnterCallback, [index])}
             className={index === state.selectedIndex ? "search-list-coursename search-list-selected" : "search-list-coursename"}
             onClick={(event) => {
               selectCourse(event, state)
             }}>{c.course_name}</div>))(state.searchResults) : undefined
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
      .filter((e) => !contains(e.keyCode, [37, 38, 39, 40]))
      .onValue((e) => {
        if (e.target.value.length > 0) {
          axios.get('/course/course', {
            params: {
              name: e.target.value
            }
          })
            .then((res) => {
              this.setState({searchResults: res.data ? res.data : []})
            })
        }
      })
  }

  render() {
    const state = this.state
    const isSearchListVisible = this.props.state
    const indexCallback = (index) => {
      this.setState({selectedIndex: index})
    }
    return <div>
      <div className="search-container">
        <input id="course-searchbox" autoFocus placeholder="Course name"
               ref='searchinput'
               onKeyDown={(event) => {
                 this.setState({searchString: event.target.value})
                 handleKeyInput(event, state, indexCallback)
               }}></input>
      </div>
      <div className="search-list-container"
           onMouseLeave={() => {
             this.setState({selectedIndex: -1})
           }}>
        {searchList(state, isSearchListVisible, indexCallback)}
      </div>
    </div>
  }
}

export default SearchList
