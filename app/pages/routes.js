import React from 'react'
import {Route} from 'react-router'
import {appState} from '../store/lukkariStore'
import {isServer} from '../utils'
import AppPage from './appPage'
import LukkariPage from './frontpage/LukkariPage'
import NotFoundPage from './notFoundPage'
import CatalogPage from './catalogpage/CatalogPage'

const fetchComponentData = (needs, params) => {
  needs.forEach((need) => {
    const action = need(params)
    appState.dispatch(action)
  })
}

export const Routes = (
  <Route component={AppPage}>
    <Route path='/'
           component={LukkariPage}
           onEnter={(nextState) => {
             if (!isServer && nextState.location.query.courses) {
               fetchComponentData(LukkariPage.needs, {courses: nextState.location.query.courses})
             }
           }}/>

    <Route path='/catalog'
           component={CatalogPage}
           onEnter={(nextState) => {
             if (!isServer) {
               fetchComponentData(CatalogPage.needs, {
                 department: 'TITE',
                 courses: nextState.location.query.courses
               })
               window.scrollTo(0, 0)
             }
           }}
           onLeave={(_) => {
             if (!isServer) {
               appState.dispatch({type: 'SYNC_URL_PARAMS'})
             }
           }}/>

    <Route path='/catalog/:department'
           component={CatalogPage}
           onEnter={(nextState) => {
             if (!isServer) {
               fetchComponentData(CatalogPage.needs, {
                 department: nextState.params.department,
                 courses: nextState.location.query.courses
               })
               window.scrollTo(0, 0)
             }
           }}/>

    <Route path='*'
           component={NotFoundPage}
           status={404}/>
  </Route>
)

export default Routes
