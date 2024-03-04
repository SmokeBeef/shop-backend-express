const responseSuccess = (res, message, data, code) => {
    return res.status(code).json({
        success: true,
        code,
        data,
        message,
    })
}

const responseErrors = (res, message, code, errors = null) => {
    return res.status(code).json({
        success: false,
        code,
        message,
        errors
    })
}

const data = (data, error) => {
    return {
        isSuccess: !!data,
        error,
        data
    }
}

module.exports = { responseErrors, responseSuccess, data }