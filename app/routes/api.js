import express from 'express'
import Parser from '../parser'
import Email from '../email'

const apiRouter = express.Router()

apiRouter.post('/update', Parser.updateCourseData)

apiRouter.post('/save', Email.sendMail)

export default apiRouter