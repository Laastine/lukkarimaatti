import nodemailer from 'nodemailer'
import config from './config'
import Logger from './logger'
import {isCourseLink, isEmail} from './utils'

module.exports = {
  sendMail: (req, res) => {
    const {email, link} = req.body
    if (isEmail(email) && isCourseLink(link)) {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: config.emailAddress,
          pass: config.emailPassword
        }
      })
      Logger.info(`name=${config.emailAddress}`)
      const mailOptions = {
        from: 'lukkarimaatti@gmail.com',
        to: email,
        subject: 'Lukkarimaatti++ course url',
        text: `Your lukkarimaatti url=${link}`
      }
      Logger.info('mailOptions', mailOptions)

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          Logger.error(error)
          res.status(500).json({status: 'email send error'})
        } else {
          Logger.info(`Message sent: ${info.response}`)
          res.status(200).json({status: 'ok'})
        }
      })
    } else {
      Logger.error('Invalid email link', email, link)
      res.status(400).send({
        error: 'Invalid email address or link'
      })
    }
  }
}
