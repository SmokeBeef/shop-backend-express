const Joi = require("joi");

exports.registerSchema = Joi.object({
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().max(155).required(),
})

exports.loginSchema = Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().max(155).required(),
})