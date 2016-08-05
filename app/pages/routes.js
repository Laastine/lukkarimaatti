import React from 'react'
import {Route} from 'react-router'
import {appState} from '../store/lukkariStore'
import {isServer} from '../utils'
import AppPage from './appPage'
import FrontPage from './frontpage/FrontPage'
import NotFoundPage from './notFoundPage'

const fetchComponentData = (needs, params) => {
  needs.forEach((need) => {
    const action = need(params)
    appState.dispatch(action)
  })
}

export const Routes = (
  <Route component={AppPage}>
    <Route path="/"
           component={FrontPage}
           onEnter={(nextState) => {
             if (!isServer) {
               fetchComponentData(FrontPage.needs, {selectedCourses: nextState.location.query.selectedCourses})
               window.scrollTo(0, 0)
             }
           }}/>

    <Route path="*"
           component={NotFoundPage}
           status={404}/>
  </Route>
)

export default Routes
