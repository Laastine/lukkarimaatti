var nodemailer = require('nodemailer'),
    config = require('./config')

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
        console.log('pass=' + config.emailPassword)
        console.log('TO', req.body.email)
        const mailOptions = {
            from: 'lukkarimaatti@gmail.com',
            to: req.body.email,
            subject: 'Lukkarimaatti++ course url',
            text: 'Your lukkarimaatti url=' + req.body.link
        }

        transporter.sendMail(mailOptions, (error, info) => {
            error ? console.log(error) : console.log('Message sent: ' + info.response)
        })
    }
}