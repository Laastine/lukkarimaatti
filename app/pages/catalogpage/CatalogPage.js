import React from 'react'
import Catalog from './Catalog'
import Header from '../../partials/header'
import Footer from '../../partials/footer'
import {loadCoursesByDepartment, loadCourses} from '../frontApi/lukkariApi'

const CatalogPage = React.createClass({
  statics: {
    needs: [loadCoursesByDepartment, loadCourses]
  },

  contextTypes: {
    appState: React.PropTypes.object
  },

  render() {
    return <div>
      <div className='content-container'>
        <Header state={this.context.appState}/>
        <Catalog state={this.context.appState}/>
        <Footer/>
      </div>
    </div>
  }
})

export default CatalogPage
