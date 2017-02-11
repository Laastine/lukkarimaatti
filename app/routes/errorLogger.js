import express from 'express'

const Logger = require('../logger')

const errorLoggerRoutes = express.Router()

errorLoggerRoutes.post('', (req, res) => {
  const errorMsg = {
    msg: req.body.error.message,
    line: req.body.error.line,
    userAgent: req.body.navigator.userAgent,
    language: req.body.navigator.language,
    systemLanguage: req.body.navigator.systemLanguage
  }
  Logger.error('Browser error', errorMsg)
  res.send('""')
  res.status(201).end()
})

export default errorLoggerRoutes
