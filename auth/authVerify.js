const jsonwebtoken = require('jsonwebtoken')
const wrapper = require('../utils/wrapper')
const authVerrifiy = async (req, res, next) => {

    try {
        const header = req.headers['authorization']
        if (header == null) {
            return wrapper.responseErrors(res, 'missing token', 401)
        }
        let token = header.split(" ")[1]
        const SECRET_KEY = process.env.SECRET_KEY
        let decodedToken
        try {
            decodedToken = jsonwebtoken.verify(token, SECRET_KEY)
        } catch (err) {
            if (err instanceof jsonwebtoken.TokenExpiredError) {

                return wrapper.responseErrors(res, 'token expired', 401)
            }
            return wrapper.responseErrors(res, 'invalid token', 401)
        }
        req.user = decodedToken
        next()
    } catch (err) {
        return wrapper.responseErrors(res, 'internal error', 500)

    }

}
module.exports = { authVerrifiy }