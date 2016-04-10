'use strict'

let childProcess
let uiChildProcess

const Promise = require('bluebird')
const spawn = require('child_process').spawn
const exec = Promise.promisify(require('child_process').exec)
const fetch = require('node-fetch')

function waitUntil(predicate, loop_timeout) {
  return new Promise((resolve, reject) => {
    const loop = setInterval(() => {
      predicate(loop_timeout)
        .then(() => {
          clearTimeout(loop)
          return resolve()
        })
        .catch(() => console.log("Waiting server startup"))
    }, loop_timeout)
  })
}

function serverPoll(url, timeout) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response ? resolve() : reject())
      .catch((e) => reject())
  })
}

function poll_localhost(timeout) {
  return serverPoll('http://localhost:8080/', timeout)
}

process.on('unhandledRejection', (reason, p) => {
  console.error('Error', reason)
  process.exit(1)
})

exec('npm i', {cwd: '.'})
  .then(() => {
    console.log('Building UI')
    return exec('npm run build', {cwd: '.'})
  })
  .then(() => {
    console.log('Starting UI')
    uiChildProcess = spawn('node', ['src/bootstrap.js'], {cwd: '.'})
    uiChildProcess.stdout.on('data', (data) => process.stdout.write(data))
    uiChildProcess.stderr.on('data', (data) => process.stderr.write(data))
  })
  .then(() => waitUntil(poll_localhost, 1000))
  .then(() => {
    console.log('Running tests...')
    return new Promise((resolve, reject) => {
      childProcess = spawn('npm', ['run', 'integration-test'], {cwd: '.'})
      childProcess.stdout.on('data', (data) => process.stdout.write(data))
      childProcess.stderr.on('data', (data) => process.stderr.write(data))

      childProcess.on('close', (code) => {
        if (code !== 0) {
          var err = new Error('Test error')
          err.code = code
          reject(err)
        }
        console.log(`Tests exited with code ${code}`)
        resolve()
      })
      childProcess.on('error', reject)
    })
  })
  .finally(() => {
    uiChildProcess.kill('SIGINT')
    console.log('Test finished')
  })