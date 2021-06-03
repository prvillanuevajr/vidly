const config = require('config')
const express = require('express')
const app = express()
const {logMiddleware,logger} = require('./startup/logging')

// Promise.reject(new Error('Unhandled rejection'))

logMiddleware(app)
require('./startup/config')()
require('./startup/validation')()
require('./startup/db')(logger)
require('./startup/routes')(app,logger)

const port = config.get('port') || 3000

module.exports = app.listen(port, () => logger.info(`Listening on port ${port}`))
