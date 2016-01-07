import express from 'express'
import Parser from '../parser'
import Email from './email'

const apiRouter = express.Router()

apiRouter.post('/update', function(req, res) {
    Parser.updateCourseData(req, res)
})

apiRouter.post('/save', function(req, res) {
    Email.sendMail(req, res)
})

export default apiRouter