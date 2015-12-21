var nodemailer = require('nodemailer'),
    config = require('./config')

module.exports = {
    sendMail: function(req, res) {
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: config.emailAddress,
                pass: config.emailPassword,
            }
        })
        console.log('name=' + config.emailAddress)
        console.log('pass=' + config.emailPassword)
        console.log('TO', req.body.email)
        var mailOptions = {
            from: 'lukkarimaatti@gmail.com',
            to: req.body.email,
            subject: 'Lukkarimaatti++ course url", "UTF-8',
            text: 'Your lukkarimaatti url=' + req.body.link
        }

        transporter.sendMail(mailOptions, function(error, info) {
            error ? console.log(error) : console.log('Message sent: ' + info.response)
        })
    }
}