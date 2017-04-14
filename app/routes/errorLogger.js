import express from 'express'

const Logger = require('../logger')

const errorLoggerRoutes = express.Router()

errorLoggerRoutes.post('', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const {message, line} = req.body.error
  Logger.error('Browser error:', message, 'line:', line, 'userAgent:', req.body.userAgent, 'IP:', ip)
  res.send('""')
  res.status(201).end()
})

export default errorLoggerRoutes
