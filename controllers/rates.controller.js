const { getRatesSchema } = require('../schema/rates.schema')
const { validate } = require('../utils/validator')
const wrapper = require('../utils/wrapper')
const ratesService = require('../service/rates.service')

exports.getRates = async (req, res) => {
    try {
        const payload = req.body
        const { data, error, isError } = validate(getRatesSchema, payload)
        if (isError) {
            return wrapper.responseErrors(res, 'failed get rates, payload not suited', 400, error)
        }

        const result = await ratesService.getRates(data)

        if (!result.isSuccess) {
            return wrapper.responseErrors(res, result.error, 400)
        }

        return wrapper.responseSuccess(res, 'success get rates', result.data, 200)

    } catch (error) {
        return wrapper.responseErrors(res, 'failed get rates, internal error', 500, error)
    }
}