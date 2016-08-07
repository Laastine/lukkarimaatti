import React from 'react'
import Catalog from './Catalog'
import {loadCoursesByDepartment} from '../frontApi/lukkariApi'
import Header from '../../partials/header'

const CatalogPage = React.createClass({
  statics: {
    needs: [loadCoursesByDepartment]
  },

  contextTypes: {
    appState: React.PropTypes.object
  },

  render() {
    return <div>
      <Header state={this.context.appState}/>
      <Catalog state={this.context.appState}/>
    </div>
  }
})

export default CatalogPage
