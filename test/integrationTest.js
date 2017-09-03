'use strict'

let childProcess
let uiChildProcess

const Promise = require('bluebird')
const {spawn} = require('child_process')
const {exec} = Promise.promisify(require('child_process'))
const axios = require('axios')
const DB = require('./../app/db')
const Parser = require('./../app/parser')
const Data = require('./unit/courseData')

const titeData = Parser.parseHtml(Data.ctCourseData)
const sateData = Parser.parseHtml(Data.blCourseData)

function waitUntil(predicate, loopTimeout) {
  return new Promise((resolve) => {
    const loop = setInterval(() => {
      predicate(loopTimeout)
        .then(() => {
          clearTimeout(loop)
          return resolve()
        })
        .catch(() => console.log('Waiting server startup')) // eslint-disable-line no-console
    }, loopTimeout)
  })
}

function serverPoll(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => response ? resolve() : reject())
      .catch(() => reject())
  })
}

function pollLocalhost(timeout) {
  return serverPoll('http://localhost:8080/', timeout)
}

process.on('unhandledRejection', reason => {
  console.error('Error', reason) // eslint-disable-line no-console
  process.exit(1)
})

exec('npm i', {cwd: '.'})
  .then(() => {
    console.log('Building UI') // eslint-disable-line no-console
    return new Promise((resolve, reject) => {
      const buildProcess = spawn('npm', ['run', 'build'], {cwd: '.'})
      buildProcess.stderr.on('data', (data) => process.stderr.write(data))
      buildProcess.on('close', (code) => {
        if (code !== 0) {
          const err = new Error('Build error')
          err.code = code
          return reject(err)
        }
        return resolve()
      })
    })
  })
  .then(() => {
    console.log('Starting UI') // eslint-disable-line no-console
    uiChildProcess = spawn('node', ['app/bootstrap.js'], {cwd: '.'})
    uiChildProcess.stdout.on('data', (data) => process.stdout.write(data))
    uiChildProcess.stderr.on('data', (data) => process.stderr.write(data))
  })
  .then(() => waitUntil(pollLocalhost, 1000))
  .then(() => {
    console.log('Populate DB') // eslint-disable-line no-console
    return DB.cleanCourseTable()
      .then(() => DB.insertCourse(titeData))
      .then(() => DB.insertCourse(sateData))
  })
  .then(() => {
    console.log('Running tests...') // eslint-disable-line no-console
    return new Promise((resolve, reject) => {
      childProcess = spawn('npm', ['run', 'integration-test'], {cwd: '.'})
      childProcess.stdout.on('data', (data) => process.stdout.write(data))
      childProcess.stderr.on('data', (data) => process.stderr.write(data))

      childProcess.on('close', (code) => {
        if (code !== 0) {
          const err = new Error('Test error')
          err.code = code
          reject(err)
        }
        console.log(`Tests exited with code ${code}`) // eslint-disable-line no-console
        resolve()
      })
      childProcess.on('error', reject)
    })
  })
  .finally(() => {
    uiChildProcess.kill('SIGINT')
    console.log('Test finished') // eslint-disable-line no-console
  })
