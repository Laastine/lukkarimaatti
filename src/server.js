var express = require('express'),
    path = require('path'),
    app = express(),
    bodyParser = require('body-parser'),
    router = express.Router(),
    DB = require('./db'),
    Parser = require('./parser'),
    Email = require('./email')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.set('port', process.env.PORT || 8080)

app.use('/dist', express.static(__dirname + '/../public/dist/'))
app.use('/img', express.static(__dirname + '/../public/img/'))

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../public/', 'index.html'))
})

app.get('/course', function(req, res) {
    console.log('/course called')
    DB.getCourseByName(req, res)
})

app.get('/codeAndGroup', function(req, res) {
    console.log('codeAndGroup called' + JSON.stringify(req.params))
    DB.getCourseByCodeAndGroup(req, res)
})

app.get('/code/:code', function(req, res) {
    console.log('code called')
    DB.getCourseByCode(req, res)
})

app.post('/update', function(req, res) {
    Parser.updateCourseData(req, res)
})

app.post('/save', function(req, res) {
    console.log('save called', req.query)
    Email.sendMail(req, res)
})

app.listen(app.get('port'), function() {
    console.log('Express server in port ' + app.get('port'))
})

app.get('/test', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../test/', 'runner.html'))
})

app.use('/test', express.static(__dirname + '/../test/'))