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
import bodyParser from 'body-parser'
import DB from './db'
import Parser from './parser'
import Email from './email'
import CourseRoutes from './routes/course'
const fs = Promise.promisifyAll(require('fs'))

const server = express()

server.use(compression({threshold: 512}))
server.use(bodyParser.json())
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

const preFetchCourses = (params) => {
    if (!params || params.match('/checksum=.*/')) {
        return []
    } else {
        return R.map((courseCode) => {
            if (courseCode.indexOf('&') > -1) {
                return {
                    courseCode: courseCode.substring(0, courseCode.indexOf('&')),
                    groupName: courseCode.substring(courseCode.indexOf('&') + 1, courseCode.length)
                }
            } else {
                return {
                    courseCode,
                    groupName: ""
                }
            }
        }, R.uniq(params.substring(0, params.length).split(/[+]/)))
    }
}

server.get('*', (req, res, next) => {
    const urlAndParams = R.split('?', req.url)
    const page = pages.findPage(urlAndParams[0])
    if (page) {
        Promise
            .all([checksumPromise(cssFilePath), checksumPromise(bundleJsFilePath), DB.prefetchCoursesByCode(preFetchCourses(urlAndParams[1]))])
            .then(([cssChecksum, bundleJsChecksum, courses]) => {
                res.send(ReactDOMServer.renderToString(basePage(
                    page,
                    page.initialState(courses),
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

server.post('/save', Email.sendMail)

server.get('/test', (req, res) => res.sendFile(path.resolve(__dirname + '/../test/', 'runner.html')))

server.use('/test', express.static(__dirname + '/../test/'))
