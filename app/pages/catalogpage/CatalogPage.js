import React from 'react'
import Catalog from './Catalog'
import Header from '../../partials/header'

const CatalogPage = React.createClass({
  statics: {
    needs: []
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
