exports.validate = (shema, data) => {
    const { error, value } = shema.validate(data || {}, { abortEarly: false })


    if (error) {
        const errors = {};
        error.details.forEach(err => {
            errors[err.path[0]] = err.message;
        });
        return {
            isError: true,
            data: null,
            error: errors
        }
    }
    return {
        isError: false,
        data: value,
        error
    }
}