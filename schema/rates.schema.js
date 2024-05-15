const Joi = require("joi");

const item = Joi.object({
    product_id: Joi.string().required(),
    quantity: Joi.number().required(),
    product_type_id: Joi.string().optional().allow(null),
    shop_id: Joi.string().required(),
    quantity: Joi.number().required()
})

exports.getRatesSchema = Joi.object({
    postal_code: Joi.string().required(),
    items: Joi.array().items(item).has(item).message('should be an array obejct and has property quantity, product_id, shop_id, and product_type_id is nullable')
})