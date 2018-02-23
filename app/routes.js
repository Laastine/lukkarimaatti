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

export const routes = [
  {
    path: '/',
    action:
      ({query: {courses}}) =>
        new Promise((resolve) => {
          if (!isServer) {
            window.scrollTo(0, 0)
          }
          fetchComponentData(LukkariPage.needs, {courses})
          resolve()
        })
          .then(() => ({component: <LukkariPage/>}))
  },
  {
    path: '/catalog',
    action:
      ({query: {courses}}) =>
        new Promise((resolve) => {
          if (!isServer) {
            window.scrollTo(0, 0)
          }
          fetchComponentData(CatalogPage.needs, {courses, department: 'TITE'})
          resolve()
        })
          .then(() => ({component: <CatalogPage/>}))
  },
  {
    path: '/catalog/:department',
    action: ({params: {department}, query: {courses}}) =>
      new Promise((resolve) => {
        if (!isServer) {
          window.scrollTo(0, 0)
        }
        fetchComponentData(CatalogPage.needs, {courses, department})
        resolve()
      })
        .then(() => ({component: <CatalogPage/>}))

  },
  {
    path: '(.*)',
    action: () => ({component: <NotFoundPage/>})
  }
]
