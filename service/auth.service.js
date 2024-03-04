const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const wrapper = require('../utils/wrapper')
const jsonwebtoken = require('jsonwebtoken')
const { sendMail } = require('../utils/sendEmail')
const db = new PrismaClient()

const register = async (data) => {

    const checkEmail = await db.user.findFirst({
        where: {
            email: data.email
        }
    })
    if (checkEmail) {
        console.log('email ', checkEmail);
        return null
    }

    data.password = await bcrypt.hash(data.password, 10)
    const result = await db.user.create({ data })

    sendMail()

    delete result.password
    return result
}

const login = async (data) => {

    const findUser = await db.user.findFirst({
        where: {
            email: data.email
        }
    })

    if (!findUser) return wrapper.data(null, 'email not register');

    const checkPass = await bcrypt.compare(data.password, findUser.password)
    if (!checkPass) return wrapper.data(null, 'password incorrect');

    const secretKey = process.env.SECRET_KEY
    const payload = {
        sub: findUser.id,
        email: findUser.email,
        no_telp: findUser.no_telp

    }
    const accessToken = jsonwebtoken.sign(payload, secretKey, { expiresIn: '1h' });

    delete findUser.password
    return wrapper.data({
        user: findUser,
        token: accessToken
    }, null)

}


module.exports = { register, login }