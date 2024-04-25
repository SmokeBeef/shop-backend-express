const Joi = require("joi");

exports.addCartItemSchema = Joi.object({
    product_id: Joi.string().required(),
    product_type_id: Joi.string().optional(),
    quantity: Joi.number().required()
})
