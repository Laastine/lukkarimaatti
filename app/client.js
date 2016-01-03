import React from 'react'
import ReactDOM from 'react-dom'
import * as pages from './pages/pages'
import basePage from './pages/basePage'

const currentPage = pages.findPage(document.location.pathname)

const App = React.createClass({
    componentWillMount () {
        currentPage
            .applicationStateProperty(window.INITIAL_STATE)
            .onValue(applicationState => this.replaceState(applicationState))
    },
    render () {
        return this.state ?
            basePage(currentPage, this.state, window.CHECKSUMS) : <span>Loading...</span>
    }
})

window.onload = () => ReactDOM.render(<App/>, document)