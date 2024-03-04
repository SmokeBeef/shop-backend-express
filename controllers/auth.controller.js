const { registerSchema, loginSchema } = require("../schema/auth.schema");
const { validate } = require("../utils/validator")
const wrapper = require("../utils/wrapper")
const authService = require('../service/auth.service')


exports.register = async (req, res) => {
    try {
        const { data, isError, error } = validate(registerSchema, req.body || {})
        if (isError) {
            return wrapper.responseErrors(res, 'failed register, missing properties', 400, error)
        }

        const result = await authService.register(data)
        if (!result)
            return wrapper.responseErrors(res, 'failed register, email already used', 409, null)

        console.log('result', result);
        return wrapper.responseSuccess(res, 'success register', result, 201)

    } catch (error) {
        return wrapper.responseErrors(res, 'failed register, internal error', 500, error)
    }
}

exports.login = async (req, res) => {
    try {
        const { data, error, isError } = validate(loginSchema, req.body || {})
        if (isError) {
            return wrapper.responseErrors(res, 'failed login, missing properties', 400, error)
        }

        const result = await authService.login(data)
        if (result.error)
            return wrapper.responseErrors(res, 'failed login, ' + result.error, 409, null)

            console.log(result);
        return wrapper.responseSuccess(res, 'success register', result.data, 201)

    } catch (error) {
        return wrapper.responseErrors(res, 'failed register, internal error', 500, error)
    
    }
}