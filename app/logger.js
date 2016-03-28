const winston = require('winston')

module.exports = new (winston.Logger)({
  level: 'debug',
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      timestamp: function () {
        return new Date().toISOString()
      }
    })]
})
