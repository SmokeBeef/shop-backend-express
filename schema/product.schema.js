const Joi = require("joi");

const productType = Joi.object({
    name: Joi.string().required().max(155),
    price: Joi.number().required(),
})

const createProductSchema = Joi.object({
    name: Joi.string().required().max(155),
    image: Joi.string().required(),
    desc: Joi.string().optional(),
    price: Joi.number().required(),
    category_id: Joi.string().required(),
    user_id: Joi.string().required(),
    product_types: Joi.array().items(productType).optional()
})



const getProductsQuerySchema = Joi.object({
    page: Joi.number().min(1).optional().default(1),
    limit: Joi.number().min(1).optional().default(10),
    search: Joi.string().optional().default(''),
    categoryId: Joi.string().optional().allow(null, '').default(null)
})


module.exports = {
    createProductSchema,
    getProductsQuerySchema
}