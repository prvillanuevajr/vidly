
module.exports = function (logger){
    return function (err, req, res, next) {
        logger.error(err.message, err)
        res.status(500).send('Something went wrong!')
    }
}