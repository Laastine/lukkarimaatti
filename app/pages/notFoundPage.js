import React from 'react'

const NotFoundPage = React.createClass({
  statics: {
    needs : []
  },

  contextTypes: {
    appState: React.PropTypes.object
  },

  render() {
    return <div>
      <div className='no-match'>404 Page Not Found</div>
    </div>
  }
})

export default NotFoundPage
