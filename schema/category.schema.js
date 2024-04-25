const Joi = require("joi");

const addCategorySchema = Joi.object({
    name: Joi.string().required()
})

const getCategoryQuerySchema = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    search: Joi.string().optional(),
})

module.exports = {
    addCategorySchema,
    getCategoryQuerySchema
}