import express from "express"
import Promise from "bluebird"
import Logger from "../logger"
import DB from "../db"

const courseRoutes = express.Router()

const buildErrorMessage = (functionName, query, ip, err) => {
  const ipParam = ip ? ' IP: ' + ip : ''
  const queryParam = typeof query === 'object' ? JSON.stringify(query) : query
  Logger.error(functionName + ', request' + queryParam + ipParam + ' error', err.stack)
}

courseRoutes.get('/course', (req, res) =>
  Promise.resolve(DB.getCourseByName(req.query['name'].toLocaleLowerCase()))
    .then((result) => res.json(result))
    .catch((err) => {
      buildErrorMessage('/course', req.query['name'], req.client.remoteAddress, err)
      res.json([])
    }))

courseRoutes.get('/codeAndGroup', (req, res) => {
  DB.getCourseByCodeAndGroup(code, groupName)
    .then((result) => res.json(result.rows))
    .error((err) => {
      buildErrorMessage('getCourseByCodeAndGroup', req.query['code'] + ' ' + req.query['groupName'], req.client.remoteAddress, err)
      res.json([])
    })
})

courseRoutes.get('/code/:code', (req, res) => {
  Promise.resolve(DB.getCourseByCode(req.params['code']))
    .then((result) => res.json(result.rows))
    .catch((err) => {
      buildErrorMessage('/code', req.query['code'], req.client.remoteAddress, err)
      res.json([])
    })
})

export default courseRoutes