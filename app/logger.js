const config = require('./config')

function timestamp() {
  return new Date().toISOString()
}

function logMsg(level, msg, args) {
  // eslint-disable-next-line no-console
  console.log(`${timestamp()} INFO - ${msg}, ${args}`)
}

const Logger = {
  info: (msg, ...args) => config.logLevel === 'info' ? logMsg('INFO', msg, args) : null,

  error: (msg, ...args) => logMsg('ERROR', msg, args)
}

module.exports = Logger
