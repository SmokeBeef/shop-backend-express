const { registerSchema, loginSchema } = require("../schema/auth.schema");
const { validate } = require("../utils/validator")
const wrapper = require("../utils/wrapper")
const authService = require('../service/auth.service')


exports.register = async (req, res) => {
    try {
        const { data, isError, error } = validate(registerSchema, req.body)
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
        const { data, error, isError } = validate(loginSchema, req.body)
        if (isError) {
            return wrapper.responseErrors(res, 'failed login, missing properties', 400, error)
        }

        const result = await authService.login(data)
        if (result.error)
            return wrapper.responseErrors(res, 'failed login, ' + result.error, 409, null)

        console.log(result);
        return wrapper.responseSuccess(res, 'success register', result.data, 200)

    } catch (error) {
        return wrapper.responseErrors(res, 'failed register, internal error', 500, error)

    }
}

exports.me = async (req, res) => {
    try {
        const id = req.user.sub;
        console.log(id);
        const result = await authService.getMe(id)
        if (result.error)
            return wrapper.responseErrors(res, 'failed get auth user' + result.error, 404, null)

        return wrapper.responseSuccess(res, 'success get auth user', result.data, 200)

    } catch (error) {
        return wrapper.responseErrors(res, 'failed register, internal error', 500, error)

    }
}

exports.accountVerify = async (req, res) => {
    try {
        const userId = req.params.userId

        const result = await authService.accountVerfiy(userId)
        if (!result.isSuccess) {
            return res.send('failed to verify')
        }

        
        res.send(`Success verify 
        <script>
        setTimeout(() => {
            window.location.replace('${process.env.REDIRECT_URL}')
        }, 1500);
        </script>
        `);

    } catch (error) {
        console.log(error);
        return res.send('failed verify, there is error in internal server')

    }
}