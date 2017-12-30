import React from 'react'
import PropTypes from 'prop-types'
import {addIndex, contains, map, partial, pipe, slice, uniq, uniqBy} from 'ramda'
import Bacon from 'baconjs'
import {searchCourses} from '../pages/frontApi/lukkariApi'
import {appState} from '../store/lukkariStore'

const LIST_MAX_LEN = 10

const visibleCourses = (state) => pipe(
  uniq,
  slice(0, LIST_MAX_LEN))(state.searchResults.map((c) => c.course_name))

const addCourse = (event, state) => {
  document.getElementById('course-searchbox').value = ''
  const courseName = visibleCourses(state)[state.selectedIndex]
  appState.dispatch({
    type: 'ADD_COURSE',
    selectedCourses: state.searchResults.filter((e) => e.course_name === courseName)
  })
}

const handleKeyInput = (event, state, indexCallback, closeCallback) => {
  if (event.keyCode === 40) { //Down
    if (state.selectedIndex < visibleCourses(state).length - 1 && state.selectedIndex < LIST_MAX_LEN) {
      indexCallback(state.selectedIndex + 1)
    }
  } else if (event.keyCode === 38) { //Up
    if (state.selectedIndex > 0) {
      indexCallback(state.selectedIndex - 1)
    }
  } else if (event.keyCode === 13) { //Enter
    closeCallback()
    addCourse(event, state)
  } else {
    indexCallback(-1)
  }
}

const searchList = (state, mouseEnterCallback, closeCallback) => {
  const mapIndexed = addIndex(map)
  return state && state.isSearchListVisible ?
    pipe(
      uniqBy((c) => c.course_name),
      slice(0, LIST_MAX_LEN),
      mapIndexed((c, index) =>
        <div key={c.course_name}
          onMouseEnter={partial(mouseEnterCallback, [index])}
          className={index === state.selectedIndex ? 'search-list-coursename search-list-selected' : 'search-list-coursename'}
          onClick={(event) => {
            closeCallback()
            addCourse(event, state)
          }}>{c.course_name}
        </div>))(state.searchResults) : null
}

class SearchList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: -1,
      searchString: '',
      searchResults: [],
      isSearchListVisible: false
    }
  }

  componentDidMount() {
    document.getElementsByClassName('search-container')[0].focus()
    this.setState(() => ({searchResults: this.props.state.searchResults}))
    Bacon.fromEventTarget(this.searchinput, 'keyup')
      .debounce(250)
      .filter((e) => !contains(e.keyCode, [37, 38, 39, 40]))
      .onValue((e) => {
        if (e.target.value.length > 0) {
          searchCourses(e.target.value)
            .then((searchResults) => {
              this.setState(() => ({
                searchResults,
                isSearchListVisible: true
              }))
            })
        } else if (e.target.value.length === 0) {
          this.setState(() => ({isSearchListVisible: false}))
        }
      })
  }

  render() {
    const {state} = this
    const indexCallback = (index) => {
      this.setState(() => ({selectedIndex: index}))
    }
    const closeCallback = () => {
      this.setState(() => ({isSearchListVisible: false}))
    }

    return <div>
      <div className='search-container'>
        <input id='course-searchbox' autoFocus placeholder='Course name'
          ref={(e) => {
            this.searchinput = e
          }}
          onKeyDown={(event) => {
            this.setState({searchString: event.target.value})
            handleKeyInput(event, state, indexCallback, closeCallback)
          }}>
        </input>
      </div>
      <div className='search-list-container'
        onMouseLeave={() => {
          this.setState(() => ({selectedIndex: -1}))
        }}>
        {searchList(state, indexCallback, closeCallback)}
      </div>
    </div>
  }
}

SearchList.displayName = 'SearchList'

SearchList.propTypes = {
  state: PropTypes.object
}

export default SearchList
