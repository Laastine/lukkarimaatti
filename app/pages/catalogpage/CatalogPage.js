import React from 'react'
import PropTypes from 'prop-types'
import Catalog from './Catalog'
import Header from '../../partials/header'
import Footer from '../../partials/footer'
import {loadCourses, loadCoursesByDepartment} from '../frontApi/lukkariApi'

class CatalogPage extends React.Component {
  render() {
    return <div>
      <div className='content-container'>
        <Header state={this.context.appState}/>
        <Catalog state={this.context.appState}/>
        <Footer/>
      </div>
    </div>
  }
}

CatalogPage.displayName = 'CatalogPage'

CatalogPage.needs = [loadCoursesByDepartment, loadCourses]

CatalogPage.contextTypes = {
  appState: PropTypes.object
}

CatalogPage.propTypes = {
  appState: PropTypes.object
}

export default CatalogPage
