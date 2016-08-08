require('babel-core/register')
require('./server').start(process.env.PORT || 8080)
