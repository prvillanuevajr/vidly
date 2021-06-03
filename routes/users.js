const express = require('express')
const router = express.Router()
const {User, validate} = require('../models/User.js')
const _ = require('lodash')
const bcrypt = require("bcrypt");
const auth = require('../middleware/auth')

router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const userExist = await User.findOne({email: req.body.email});
    if (userExist) return res.status(401).send('User was already registered')
    const user = new User(_.pick(req.body, ['name', 'email']))
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    res.send(_.pick(await user.save(), ['_id', 'name', 'email']));
})

router.get('/logins')

module.exports = router;