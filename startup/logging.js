const winston = require('winston')
const logger = winston.createLogger({
    transports: [
        new winston.transports.File({filename: 'logfile.log'})
    ],
    exceptionHandlers: [
        new winston.transports.File({filename: 'uncaughtExceptions.log'})
    ],
    rejectionHandlers: [
        new winston.transports.File({filename: 'uncaughtRejection.log'})
    ],
    // exitOnError: false
})

if (process.env.NODE_ENV != 'production' && false){
    logger.add(new winston.transports.Console())
}

const logMiddleware = function (app) {
    app.use(require('../middleware/error')(logger));
}
module.exports.logMiddleware = logMiddleware
module.exports.logger = logger