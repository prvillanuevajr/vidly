const config = require('config')
const mongoose = require('mongoose')
const Fawn = require('fawn');

module.exports = function (logger) {
    Fawn.init(mongoose)
    mongoose.connect(config.get('db'), {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    }).then(() => logger.info(`Connected to ${config.get('db')}`))
}