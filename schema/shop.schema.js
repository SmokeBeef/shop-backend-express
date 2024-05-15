const Joi = require("joi");

exports.createShopSchema = Joi.object({
    name: Joi.string().required().max(155),
    image: Joi.string().optional(),
    desc: Joi.string().optional(),
    user_id: Joi.string().required(),
    address: Joi.string().required(),
    postal_code: Joi.number().required(),
    phone_number: Joi.string()
        .pattern(/^-?\d+\.?\d*$/, { name: "number" }).required()
})
