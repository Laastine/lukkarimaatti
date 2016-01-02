import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import basePage from './pages/basePage.js'
import * as pages from './pages/pages.js'
import path from 'path'
import R from 'ramda'
import compression from 'compression'
import crypto from 'crypto'
import Promise from 'bluebird'
import DB from './db'
import Parser from './parser'
import Email from './email'
import CourseRoutes from './routes/course'
const fs = Promise.promisifyAll(require('fs'))

const server = express()

server.use(compression({threshold: 512}))
server.disable('x-powered-by')
server.use('/course', CourseRoutes)

const cssFilePath = path.resolve(`${__dirname}/../.generated/style.css`)
const bundleJsFilePath = path.resolve(`${__dirname}/../.generated/bundle.js`)
const favicon = path.resolve(`${__dirname}/../app/img/favicon.png`)

const checksumPromise = filePath =>
    fs
        .readFileAsync(filePath)
        .then(fileContent => crypto.createHash('md5')
            .update(fileContent)
            .digest('hex'))

server.get('*', (req, res, next) => {
    const page = pages.findPage(R.split('?', req.url)[0])
    if (page) {
        Promise
            .all([checksumPromise(cssFilePath), checksumPromise(bundleJsFilePath)])
            .then(([cssChecksum, bundleJsChecksum]) => {
                res.send(ReactDOMServer.renderToString(basePage(
                    page,
                    page.initialState,
                    {cssChecksum, bundleJsChecksum}
                )))
            })
            .catch(next)
    } else {
        next()
    }
})

const serveStaticResource = filePath => (req, res, next) => {
    checksumPromise(filePath)
        .then(checksum => {
            if (req.query.checksum == checksum) {
                const oneDayInSeconds = 60 * 60 * 24
                res.setHeader('Cache-Control', `public, max-age=${oneDayInSeconds}`)
                res.sendFile(filePath)
            } else {
                res.status(404).send()
            }
        })
        .catch(next)
}

server.get('/style.css', serveStaticResource(cssFilePath))

server.get('/bundle.js', serveStaticResource(bundleJsFilePath))

export const start = port => {
    const reportPages = () => {
        pages.allPages.forEach(({pagePath}) => {
            console.log(`Page available at http://localhost:${port}${pagePath}`.green)
        })
    }
    return new Promise((resolve, reject) => {
        server.listen(port, resolve)
    }).then(reportPages)
}

server.post('/save', function(req, res) {
    Email.sendMail(req, res)
})

server.get('/test', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../test/', 'runner.html'))
})

server.use('/test', express.static(__dirname + '/../test/'))
