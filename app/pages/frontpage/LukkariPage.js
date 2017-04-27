import React from 'react'
import PropTypes from 'prop-types'
import Lukkari from './Lukkari'
import Header from '../../partials/header'
import Footer from '../../partials/footer'
import {loadCourses} from '../frontApi/lukkariApi'

class LukkariPage extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return <div className='content-container'>
      <Header state={this.context.appState}/>
      <Lukkari state={this.context.appState}/>
      <Footer/>
    </div>
  }
}

LukkariPage.displayName = 'LukkariPage'

LukkariPage.needs = [loadCourses]

LukkariPage.contextTypes = {
  appState: PropTypes.object
}

LukkariPage.PropTypes = {
  appState: PropTypes.object
}

export default LukkariPage
