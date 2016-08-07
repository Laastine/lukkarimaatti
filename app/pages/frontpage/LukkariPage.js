import React from 'react'
import Lukkari from './Lukkari'
import {loadCourses} from '../frontApi/lukkariApi'

const LukkariPage = React.createClass({
  statics: {
    needs : [loadCourses]
  },

  contextTypes: {
    appState: React.PropTypes.object
  },

  render() {
    return <div>
      <Lukkari state={this.context.appState}/>
    </div>
  }
})

export default LukkariPage
