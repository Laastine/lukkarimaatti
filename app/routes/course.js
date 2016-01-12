import express from 'express'
import DB from '../db'

const courseRoutes = express.Router()

courseRoutes.get('/course', function(req, res) {
    DB.getCourseByName(req, res)
})

courseRoutes.get('/codeAndGroup', function(req, res) {
    DB.getCourseByCodeAndGroup(req, res)
})

courseRoutes.get('/code/:code', function(req, res) {
    DB.getCourseByCode(req, res)
})

export default courseRoutes