import express from 'express'
import Promise from 'bluebird'
import Logger from '../logger'
import {map, uniq, uniqBy} from 'ramda'
import DB from '../db'

const courseRoutes = express.Router()

const buildErrorMessage = (functionName, query, ip, err) => {
  const ipParam = ip ? ` IP: ${ip}` : ''
  const queryParam = typeof query === 'object' ? JSON.stringify(query) : query
  Logger.error(`${functionName}, request${queryParam}${ipParam} error`, err.stack)
}

const extractCourseParams = params => {
  if (params) {
    return map(courseCode => {
      if (courseCode.indexOf('-') > -1) {
        return {
          courseCode: courseCode.substring(0, courseCode.indexOf('-')),
          groupName: courseCode.substring(courseCode.indexOf('-') + 1, courseCode.length)
        }
      } else {
        return {
          courseCode,
          groupName: ''
        }
      }
    }, uniq(params.substring(0, params.length).split(' ')))
  } else {
    return []
  }
}

courseRoutes.get('/course', (req, res) =>
  Promise.resolve(DB.getCourseByName(req.query.name))
    .then(result => res.json(result))
    .catch(err => {
      buildErrorMessage('/course', req.query.name, req.client.remoteAddress, err)
      res.json([])
    }))

courseRoutes.get('/codeAndGroup', (req, res) =>
  Promise.resolve(DB.getCourseByCodeAndGroup(req.query.courseCode, req.query.groupName))
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      buildErrorMessage('/codeAndGroup', req.query.code, req.client.remoteAddress, err)
      res.status(500).json([])
    }))

courseRoutes.get('/code', (req, res) =>
  Promise.resolve(DB.getCourseByCode(req.query.courseCode))
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      buildErrorMessage('/code', req.query.code, req.client.remoteAddress, err)
      res.status(500).json([])
    }))

courseRoutes.get('/courses', (req, res) =>
  Promise.resolve(DB.prefetchCoursesByCode(extractCourseParams(req.query.courses)))
    .then(result => res.json(result))
    .catch(err => {
      buildErrorMessage('/courses', req.query.courses, req.client.remoteAddress, err)
      res.status(500).json([])
    }))

courseRoutes.get('/byDepartment/:department', (req, res) => {
  const department = req.params.department === 'ENTE-YMTE' ? 'ente/ymte' : req.params.department
  return Promise.resolve(DB.getCourseByDepartment(department))
    .then(result => res.json(uniqBy(c => c.course_name.toUpperCase(), result)))
    .catch(err => {
      buildErrorMessage('/byDepartment', req.params.department, req.client.remoteAddress, err)
      res.status(500).json([])
    })
})

export default courseRoutes
