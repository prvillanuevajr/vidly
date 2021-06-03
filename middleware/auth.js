const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require("config");

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) res.status(401).send('Not Authenticated. Not Token Provided')
    try {
        const decodedToken = jwt.verify(token,config.get('jwtPrivateKey'))
        req.user = decodedToken;
        next()
    } catch (e) {
        res.status(400).send('Invalid Token')
    }
}