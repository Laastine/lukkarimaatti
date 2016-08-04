import React from "react"
import {Router, RouterContext} from "react-router"
import {appState} from "../store/lukkariStore"
import {isServer} from "../utils"

let listener

const App = React.createClass({
  getInitialState() {
    return isServer ? this.props.state : window.STATE
  },

  childContextTypes: {
    appState: React.PropTypes.object
  },

  componentDidMount() {
    listener = appState.changes().onValue((state) => this.setState(state))
  },

  componentWilUnmount() {
    listener()
  },

  getChildContext() {
    return {appState: this.state}
  },

  render() {
    return isServer ? <RouterContext {...this.props.renderProps}/> : <Router {...this.props.renderProps}/>
  }
})

export default App
