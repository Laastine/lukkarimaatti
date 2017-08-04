import React from 'react'
import {appState} from './store/lukkariStore'
import {isServer} from './utils'
import history from './history'
import LukkariPage from './pages/frontpage/LukkariPage'
import NotFoundPage from './pages/notFoundPage'
import CatalogPage from './pages/catalogpage/CatalogPage'

const fetchComponentData = (needs, params) => {
  needs.forEach((need) => {
    const action = need(params)
    appState.dispatch(action)
  })
}

export const onLinkClick = event => {
  event.preventDefault()
  history.push(event.currentTarget.getAttribute('href'))
}

export const routes = {
  path: '/',
  children: [
    {
      path: '/',
      action:
        ({query}) =>
          new Promise((resolve) => {
            fetchComponentData(LukkariPage.needs, isServer ? {courses: []} : {courses: query.courses})
            resolve()
          })
            .then(() => ({component: <LukkariPage/>}))
    },
    {
      path: '/catalog',
      children: [
        {
          path: '/:department',
          action: () => ({component: <CatalogPage/>})
        }
      ],
      action: () => ({component: <CatalogPage/>})
    },
    {
      path: '*',
      action: () => ({component: <NotFoundPage/>})
    }
  ]
}
