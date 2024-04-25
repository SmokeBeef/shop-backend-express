const Joi = require("joi");

exports.createShopSchema = Joi.object({
    name: Joi.string().required().max(155),
    image: Joi.string().optional(),
    desc: Joi.string().optional(),
    user_id: Joi.string().required()
})
