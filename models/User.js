const Joi = require('joi')
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require("config");

const schema = new mongoose.Schema({
    name: {type: String, required: true, min: 5, max: 30},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, min: 5, max: 30},
    isAdmin: Boolean
})

schema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            isAdmin: this.isAdmin
        },
        config.get('jwtPrivateKey')
    );
    return token;
};

const User = mongoose.model('User', schema);

const validate = function (value) {
    return Joi.object({
        name: Joi.string().required().min(5).max(30),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(5).max(30),
    }).validate(value)
}

module.exports.User = User;
module.exports.validate = validate;