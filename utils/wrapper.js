const responseSuccess = (res, message, data, code, meta = null) => {
    return res.status(code).json( !meta ? {
        success: true,
        code,
        data,
        message,
    } : {
        success: true,
        code,
        data,
        message,
        meta
    })
}

const responseErrors = (res, message, code, errors = null) => {
    return res.status(code).json({
        success: false,
        code,
        message,
        data: null,
        errors
    })
}

const data = (data, error) => {
    return {
        isSuccess: !!data,
        error,
        data,
        meta: null
    }
}

const dataWithMeta = (data, meta = null) => {
    return {
        isSuccess: !!data,
        data,
        error: null,
        meta
    }
}

module.exports = { responseErrors, responseSuccess, data, dataWithMeta }