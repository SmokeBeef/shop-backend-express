const { addCategorySchema, getCategoryQuerySchema } = require('../schema/category.schema')
const { validate } = require('../utils/validator')
const wrapper = require('../utils/wrapper')
const categoryService = require('../service/category.service')

exports.addCategory = async (req, res) => {
    try {

        const { data, error, isError } = validate(addCategorySchema, req.body)

        if (isError) {
            return wrapper.responseErrors(res, 'payload not suited', 400, error)
        }

        const result = await categoryService.createCategory(data)

        if(!result.isSuccess)
            return wrapper.responseErrors(res, result.error, 400)

        return wrapper.responseSuccess(res, 'success create new tag', result.data, 201)

    } catch (error) {
        console.log(error);
        return wrapper.responseErrors(res, 'failed create new tag, internal error', 500, error)

    }
}

exports.getCategories = async (req, res) => {
    try {
        const query = req.query

        const { data, error, isError } = validate(getCategoryQuerySchema, query)

        if (isError) {
            return wrapper.responseErrors(res, 'payload not suited', 400, error)
        }
        const result = await categoryService.getCategoriesPaginate(data.page || 1, data.limit || 10, data.search || '')

        

        return wrapper.responseSuccess(res, 'success get Category paginate', result.data, 200, result.meta)

    } catch (error) {
        console.log();
        return wrapper.responseErrors(res, 'failed get Category, internal error', 500, error)

    }
}