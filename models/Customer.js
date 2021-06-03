const Joi = require('joi')
const mongoose = require('mongoose')

const validate = function (value) {
    return Joi.object({
        isGold: Joi.boolean().required(),
        name: Joi.string().min(5).max(30).required(),
        phone: Joi.string().required().min(9).max(13),
    }).validate(value)
}

const schema = new mongoose.Schema({
    isGold: {type: Boolean, required: true},
    name: {type: String, required: true, min: 3 ,max: 30},
    phone: {type: String, required: true, min: 9 ,max: 13},
})

const Customer = mongoose.model('Customer', schema)

exports.Customer = Customer;
exports.validate = validate;