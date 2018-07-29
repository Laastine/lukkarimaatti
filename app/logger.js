const config = require('./config')

function timestamp() {
  return new Date().toISOString()
}

function logMsg(level, msg, args) {
  console.log(`${timestamp()} INFO - ${msg}, ${args}`)
}

const Logger = {
  info: (msg, ...args) => {
    if (config.logLevel === 'info'){
      logMsg('INFO', msg, args)
    }
  },

  error: (msg, ...args) => logMsg('ERROR', msg, args)
}

module.exports = Logger
