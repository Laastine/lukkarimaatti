import express from 'express'
import path from 'path'
import {merge} from 'ramda'
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
import forceSSL from 'express-force-ssl'
import {renderFullPage} from './pages/initPage'
import {hsts, frameOptions} from './httpUtils'
import Logger from './logger'
import UniversalRouter from 'universal-router'
import {routes} from './routes'

const fs = Promise.promisifyAll(require('fs'))

process.on('unhandledRejection', (reason, p) => {
  Logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

const server = express()

server.use(compression({threshold: 512}))
server.use(hsts())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))
server.disable('x-powered-by')
server.use('/course', CourseRoutes)
server.use('/api', ApiRoutes)

server.use('/favicon.png', express.static(`${__dirname}/img/favicon.png`))
server.use('/favicon.ico', express.static(`${__dirname}/img/favicon.png`))
server.use('/github.png', express.static(`${__dirname}/img/github.png`))
server.use('/spinner.gif', express.static(`${__dirname}/img/spinner.gif`))

const cssFilePath = path.resolve(`${__dirname}/../.generated/styles.css`)
const bundleJsFilePath = path.resolve(`${__dirname}/../.generated/bundle.js`)

if (process.env.NODE_ENV !== 'production') {
  server.use('/test/', express.static(path.resolve(`${__dirname}'/../test`)))
  server.use('/node_modules/', express.static(path.resolve(`${__dirname}'/../node_modules`)))
} else {
  server.use(forceSSL)
  server.use(frameOptions())
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

server.get('/.well-known/acme-challenge/:content', (req, res) => res.send(appConfig.letsEncryptReponse))
server.use('/errors', errorLoggerRoutes)

const router = new UniversalRouter(routes)

server.get('*', (req, res) => {
  router.resolve({path: req.path, query: req.query})
    .then((routeData) => Promise
      .all([checksumPromise(cssFilePath), checksumPromise(bundleJsFilePath)])
      .then(([cssChecksum, bundleJsChecksum]) => {
        const initialState = merge(appState.currentState, buildInitialState(routeData.path))
        return Promise.resolve(renderFullPage(
          routeData.component,
          initialState,
          {cssChecksum, bundleJsChecksum}
        ))
          .then((page) => res.send(page))
      })
      .catch((err) => {
        res.status(500).send('Server error')
        Logger.error('Server error', err.stack)
      }))
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
