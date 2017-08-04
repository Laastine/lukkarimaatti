import React from 'react'
import PropTypes from 'prop-types'
import {appState} from '../store/lukkariStore'
import {isServer} from '../utils'

let listener

class App extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = isServer ? props.state : window.STATE
  }

  componentDidMount() {
    listener = appState.changes().onValue((state) => {
      this.setState(state)
    })
  }

  componentWillUnmount() {
    listener()
  }

  getChildContext() {
    return {appState: this.state}
  }

  render() {
    return this.props.component
  }
}

App.childContextTypes = {
  appState: PropTypes.object
}

App.propTypes = {
  appState: PropTypes.object
}

export default App
