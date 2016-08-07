'use strict'

require('./augmentRuntime')
require('./server').start(process.env.PORT || 8080)
