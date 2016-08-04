import React from 'react'
import Lukkari from './Lukkari'

const FrontPage = React.createClass({
  statics: {
    needs : []
  },

  contextTypes: {
    appState: React.PropTypes.object
  },

  render() {
    console.log('Front render', this.context.appState)
    return <div>
      <Lukkari state={this.context.appState}/>
    </div>
  }
})

export default FrontPage
