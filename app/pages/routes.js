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
             console.log('ROOT ROUTE')
             if (!isServer) {
               //fetchComponentData(FrontPage.needs, null)
               window.scrollTo(0, 0)
             }
           }}/>

    <Route path="*"
           onEnter={() => {console.log('NOT FOUND')}}
           component={NotFoundPage}
           status={404}/>
  </Route>
)

export default Routes
