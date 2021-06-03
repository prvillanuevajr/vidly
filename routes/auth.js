const config = require('config');
const jwt = require('jsonwebtoken')
const express = require('express')
const bcrypt = require("bcrypt");
const {User} = require("../models/User");
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send('Bad Credentials')
    const user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send('Bad Credentials')
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Bad Credentials');

    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user, ['email', 'name', '_id']));
})

function validate(value) {
    return Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).validate(value)
}

module.exports = router;