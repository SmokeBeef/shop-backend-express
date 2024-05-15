const Joi = require("joi");

const item = Joi.object({
    product_id: Joi.string().required(),
    quantity: Joi.number().required(),
    product_type_id: Joi.string().optional().allow(null),
    shop_id: Joi.string().required(),

})

exports.createOrderSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    postal_code: Joi.number().required(),
    phone: Joi.string().required(),
    courier: Joi.string().required(),
    destination_note: Joi.string().allow(null).optional(),
    
    items: Joi.array().items(item).required(),
})