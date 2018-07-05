const winston = require('winston')
const util = require('util')
const config = require('./config')

module.exports = winston.createLogger({
  level: config.logLevel ? config.logLevel : 'info',
  transports: [
    new (winston.transports.Console)({
      timestamp: () => new Date().toISOString(),
      formatter: options => `${options.timestamp()} ${options.level.toUpperCase()} ${options.message ? options.message : ''}  ${(options.meta && Object.keys(options.meta).length ? `\n\t${util.inspect(options.meta)}` : '')}`
    })
  ]
})
