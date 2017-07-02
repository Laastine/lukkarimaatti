import express from 'express'
import path from 'path'
import cors from 'cors'
import {merge} from 'ramda'
import {match} from 'react-router'
import compression from 'compression'
import appConfig from './config'
import crypto from 'crypto'
import Promise from 'bluebird'
import bodyParser from 'body-parser'
import DB from './db'
import CourseRoutes from './routes/course'
import ApiRoutes from './routes/api'
import errorLoggerRoutes from './routes/errorLogger'
import {appState} from './store/lukkariStore'
import Routes from './pages/routes'
import forceSSL from 'express-force-ssl'
import {renderFullPage} from './pages/initPage'
import Logger from './logger'

const fs = Promise.promisifyAll(require('fs'))

process.on('unhandledRejection', (reason, p) => {
  Logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

const server = express()

server.use(cors({
  origin:['http://localhost:8080'],
  methods:['GET', 'POST'],
  credentials: true
}))
server.use(compression({threshold: 512}))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))
server.disable('x-powered-by')
server.use('/course', CourseRoutes)
server.use('/api', ApiRoutes)

server.use('/favicon.png', express.static(`${__dirname}/img/favicon.png`))
server.use('/github.png', express.static(`${__dirname}/img/github.png`))
server.use('/spinner.gif', express.static(`${__dirname}/img/spinner.gif`))

const cssFilePath = path.resolve(`${__dirname}/../.generated/styles.css`)
const bundleJsFilePath = path.resolve(`${__dirname}/../.generated/bundle.js`)

if (process.env.NODE_ENV !== 'production') {
  server.use('/test/', express.static(path.resolve(`${__dirname}'/../test`)))
  server.use('/node_modules/', express.static(path.resolve(`${__dirname}'/../node_modules`)))
} else {
  server.use(forceSSL)
  server.set('forceSSLOptions', {
    enable301Redirects: true,
    trustXFPHeader: true,
    httpsPort: 443,
    sslRequiredMessage: 'SSL Required.'
  })
}

const checksumPromise = filePath =>
  fs
    .readFileAsync(filePath)
    .then(fileContent => crypto.createHash('md5')
      .update(fileContent)
      .digest('hex'))

const serveStaticResource = (filePath) => (req, res, next) =>
  checksumPromise(filePath)
    .then(checksum => {
      if (req.params.checksum === checksum) {
        const twoHoursInSeconds = 60 * 60 * 2
        res.setHeader('Cache-Control', `public, max-age=${twoHoursInSeconds}`)
        res.setHeader('ETag', checksum)
        res.sendFile(filePath)
      } else {
        res.status(404).send()
      }
    })
    .catch(next)

server.get('/static/:checksum/styles.css', serveStaticResource(cssFilePath))
server.get('/static/:checksum/bundle.js', serveStaticResource(bundleJsFilePath))

const buildInitialState = (displayName) => {
  const pageState = () => {
    switch (displayName) {
      case 'LukkariPage':
        return {}
      case 'CatalogPage':
        return {}
      case 'NotFoundPage':
        return {}
      default:
        return null
    }
  }

  return {
    ...pageState, ...{
      selectedCourses: [],
      searchResults: [],
      currentDate: new Date(),
      isModalOpen: false,
      selectedIndex: -1,
      waitingAjax: false,
      departmentCourses: [],
      department: 'TITE'
    }
  }
}

const getNeedFunctionParams = (displayName, params, queryParams) => {
  switch (displayName) {
    case 'LukkariPage':
      return {
        courses: queryParams.courses
      }
    case 'CatalogPage':
      return {
        department: params.department ? params.department.toUpperCase() : 'TITE'
      }
    default:
      return null
  }
}

const fetchComponentData = (components, pathParams, queryParams) => {
  const needs = components.reduce((prev, current) => {
    return current ? (current.needs || []).concat(prev) : prev
  }, [])
  const promises = needs.reduce((prev, currNeed) => {
    const param = getNeedFunctionParams(components[1].displayName, pathParams, queryParams)
    if (param) {
      const action = currNeed(param)
      appState.dispatch(action)
      return prev.concat(action.promise)
    } else {
      return prev
    }
  }, [])
  return Promise.all(promises)
}

server.get('/.well-known/acme-challenge/:content', (req, res) => res.send(appConfig.letsEncryptReponse))
server.use('/errors', errorLoggerRoutes)

server.get('*', (req, res) => {
  const urlPath = req.url
  match({routes: Routes, location: urlPath}, (error, redirectLocation, renderProps) => {
    if (error) {
      return res.status(500).send('Server error')
    } else if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps === null) {
      return res.status(404).send('Not found')
    } else {
      return Promise
        .all([checksumPromise(cssFilePath), checksumPromise(bundleJsFilePath), fetchComponentData(renderProps.components, renderProps.params, renderProps.location.query)])
        .then(([cssChecksum, bundleJsChecksum]) => {
          const initialState = merge(appState.currentState, buildInitialState(renderProps.components[1].displayName))
          return Promise.resolve(renderFullPage(
            initialState,
            {cssChecksum, bundleJsChecksum},
            renderProps
          ))
            .then((page) => res.send(page))
        })
        .catch((err) => {
          res.status(500).send('Server error')
          Logger.error('Server error', err.stack)
        })
    }
  })
})

export const start = (port) => {
  const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
  const reportPages = () => {
    Logger.info(`Page available at http://localhost:${port} in ${env}`)
  }

  return DB.isTableInitialized('course')
    .then((exists) => exists ? null : DB.initializeDb())
    .then(() => new Promise((resolve) => {
      server.listen(port, resolve)
    })).then(reportPages)
}
