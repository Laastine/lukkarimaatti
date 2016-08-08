import React from 'react'
import Lukkari from './Lukkari'
import Header from '../../partials/header'
import Footer from '../../partials/footer'
import {loadCourses} from '../frontApi/lukkariApi' // eslint-disable-line

const LukkariPage = React.createClass({
  statics: {
    needs: [loadCourses]
  },

  contextTypes: {
    appState: React.PropTypes.object
  },

  render() {
    return <div>
      <Header state={this.context.appState}/>
      <Lukkari state={this.context.appState}/>
      <Footer/>
    </div>
  }
})

export default LukkariPage
