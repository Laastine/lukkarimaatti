import nodemailer from 'nodemailer'
import config from './config'

module.exports = {
    sendMail: (req, res) => {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: config.emailAddress,
                pass: config.emailPassword,
            }
        })
        console.log('name=' + config.emailAddress)
        console.log('req body', req.body)
        const mailOptions = {
            from: 'lukkarimaatti@gmail.com',
            to: req.body.email,
            subject: 'Lukkarimaatti++ course url',
            text: 'Your lukkarimaatti url=' + req.body.link
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                res.status(500).json({status: 'email send error'})
            } else {
                console.log('Message sent: ' + info.response)
                res.status(200).json({status: 'ok'})
            }
        })
    }
}