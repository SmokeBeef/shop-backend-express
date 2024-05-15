const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const wrapper = require('../utils/wrapper')
const jsonwebtoken = require('jsonwebtoken')
const { sendMail } = require('../utils/sendEmail')
const db = new PrismaClient()

const register = async (data) => {

    const checkEmail = await db.users.findFirst({
        where: {
            email: data.email
        }
    })
    if (checkEmail) {
        console.log('email ', checkEmail);
        return null
    }

    data.password = await bcrypt.hash(data.password, 10)
    const result = await db.users.create({ data })

    sendMail(result.email, `${result.first_name} ${result.last_name}`, result.id)


    delete result.password
    return result
}

const login = async (data) => {

    const findUser = await db.users.findFirst({
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
    const accessToken = jsonwebtoken.sign(payload, secretKey, { expiresIn: '3h' });

    delete findUser.password
    return wrapper.data({
        user: findUser,
        token: accessToken
    }, null)

}

const getMe = async (id) => {
    const user = await db.users.findUnique({
        where: {
            id
        }
    })
    delete user.password

    return wrapper.data(user, null);
}

const accountVerfiy = async (userId) => {
    const user = await db.users.findFirst({
        where: {
            id: userId,
            is_verified: false
        }
    })

    if (!user) {
        return wrapper.data(null, 'account not found')
    }
    console.log(user);
    const updatedUser = await db.users.update({
        where: {
            id: userId
        },
        data: {
            is_verified: true
        }
    })
    db.carts.create({
        data: {
            user_id: userId
        }
    })

    return wrapper.data(updatedUser)
}

module.exports = { register, login, getMe, accountVerfiy }