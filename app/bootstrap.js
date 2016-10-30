require('babel-core/register')
require('./server').start(Number(process.env.PORT || 8080))
