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
  if (!isServer) {
    const client = require('./client')
    client.render(history.location)
  }
}

export const routes = {
  path: '/',
  children: [
    {
      path: '/',
      action:
        ({query: {courses}}) =>
          new Promise((resolve) => {
            fetchComponentData(LukkariPage.needs, {courses: []})
            resolve()
            window.scrollTo(0, 0)
          })
            .then(() => ({component: <LukkariPage/>}))
    },
    {
      path: '/catalog',
      children: [
        {
          path: '/',
          action:
            ({query: {courses}}) =>
              new Promise((resolve) => {
                fetchComponentData(CatalogPage.needs, {courses, department: 'TITE'})
                resolve()
                window.scrollTo(0, 0)
              })
                .then(() => ({component: <CatalogPage/>}))
        },
        {
          path: '/:department',
          action: ({params: {department}, query: {courses}}) =>
            new Promise((resolve) => {
              fetchComponentData(CatalogPage.needs, {courses, department})
              resolve()
              window.scrollTo(0, 0)
            })
              .then(() => ({component: <CatalogPage/>}))

        }
      ]
    },
    {
      path: '*',
      action: () => ({component: <NotFoundPage/>})
    }
  ]
}
