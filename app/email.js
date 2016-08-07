'use strict'

import nodemailer from 'nodemailer'
import config from './config'
import Logger from './logger'

module.exports = {
  sendMail: (req, res) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.emailAddress,
        pass: config.emailPassword,
      }
    })
    Logger.info('name=' + config.emailAddress)
    const mailOptions = {
      from: 'lukkarimaatti@gmail.com',
      to: req.body.email,
      subject: 'Lukkarimaatti++ course url',
      text: 'Your lukkarimaatti url=' + req.body.link
    }
    Logger.info('mailOptions', mailOptions)

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        Logger.error(error)
        res.status(500).json({status: 'email send error'})
      } else {
        Logger.info('Message sent: ' + info.response)
        res.status(200).json({status: 'ok'})
      }
    })
  }
}