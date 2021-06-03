const Joi = require('joi')
const mongoose = require('mongoose')

const validate = function (value) {
    return Joi.object({
        name: Joi.string().min(5).max(50).required()
    }).validate(value)
}

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})

const Genre = mongoose.model('Genre', schema)

exports.Genre = Genre;
exports.validate = validate;
exports.genreSchema = schema;