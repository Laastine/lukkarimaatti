import React from 'react'

const AppPage = React.createClass({
  contextTypes: {
    appState: React.PropTypes.object
  },

  render() {
    return <div id='app-root'>
      {this.props.children}
    </div>
  }
})

export default AppPage
