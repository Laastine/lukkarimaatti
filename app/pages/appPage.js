import React from 'react'
import PropTypes from 'prop-types'

class AppPage extends React.Component {
  render() {
    return <div id='app-root'>
      {this.props.children}
    </div>
  }
}

AppPage.propTypes = {
  children: PropTypes.array
}

export default AppPage
