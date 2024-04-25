const { PrismaClient } = require("@prisma/client")
const wrapper = require('../utils/wrapper')
const { calcPaginate } = require("../utils/calcPaginate")

const db = new PrismaClient()


exports.createCartItem = async (userId, data) => {

    let cart = await db.carts.findFirst({
        where: {
            user_id: userId
        }
    })

    if (!cart) {
        cart = await db.carts.create({
            data: {
                user_id: userId
            }
        })
    }

    const product = await db.products.findUnique({
        where: {
            id: data.product_id,
            product_types: data.product_types ? {
                every: {
                    id: data.product_type_id
                }
            } : {}
        }
    })

    if (!product) {
        return wrapper.data(null, 'product not found')
    }

    const ifDataExists = await db.cart_items.findFirst({
        where: {
            cart_id: cart.id,
            product_id: data.product_id,
            product_type_id: data.product_type_id
        }
    })

    if (ifDataExists) {
        return wrapper.data(null, 'cart item already exists in cart')
    }


    const result = await db.cart_items.create({
        data: {
            cart_id: cart.id,
            ...data
        },
    })

    return wrapper.data(result);
}


exports.getCartByUser = async (userId) => {

    const result = await db.carts.findFirst({
        where: {
            user_id: userId
        },
        include: {
            items: {
                include: {
                    product: true,
                    product_type: true
                }
            }
        }
    })
    return wrapper.data(result)
}

exports.updateCartItem = async (userId, cartItemId, data) => {

    const cart = await db.carts.findFirst({
        where: {
            user_id: userId
        }
    })

    if (!cart) {
        return wrapper.data(null, 'cart not found')
    }

    const result = await db.cart_items.update({
        where: {
            id: cartItemId,
            cart_id: cart.id
        },
        data: {
            ...data
        }
    })

    return wrapper.data(result)

}

exports.deleteCartItem = async (userId, cartItemId) => {

    const cart = await db.carts.findFirst({
        where: {
            user_id: userId
        }
    })
    if (!cart) {
        return wrapper.data(null, 'cart not found')
    }

    const isDataExists = await db.cart_items.findFirst({
        where: {
            cart_id: cart.id,
            id: cartItemId
        }
    })
    if (!isDataExists) {
        return wrapper.data(null, 'cart item not found')
    }

    const result = await db.cart_items.delete({
        where: {
            cart_id: cart.id,
            id: cartItemId
        }
    })

    return wrapper.data(result)

}