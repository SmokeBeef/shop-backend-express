const { addCartItemSchema } = require('../schema/cart.schema')
const cartService = require('../service/cart.service')
const { validate } = require('../utils/validator')
const wrapper = require('../utils/wrapper')

exports.addCartItem = async (req, res) => {
    try {
        const payload = req.body
        const { data, error, isError } = validate(addCartItemSchema, payload)
        if (isError) {
            return wrapper.responseErrors(res, 'failed, payload not suited', 400, error);
        }

        const result = await cartService.createCartItem(req.user.sub, data);

        if (!result.isSuccess)
            return wrapper.responseErrors(res, result.error, 404)

        return wrapper.responseSuccess(res, 'success create new cart item', result.data, 201);

    } catch (error) {
        console.log(error);
        return wrapper.responseErrors(res, 'failed create new cart item, internal error', 500, error)
    }
}

exports.getUserCart = async (req, res) => {
    try {
        const userId = req.user.sub

        const result = await cartService.getCartByUser(userId)

        return wrapper.responseSuccess(res, 'success get cart', result.data, 200);


    } catch (error) {
        return wrapper.responseErrors(res, 'failed create new cart item, internal error', 500, error)
    }
}

exports.updateCart = async (req, res) => {
    try {
        const payload = req.body
        const cartItemId = req.params.cartItemId
        const { data, error, isError } = validate(addCartItemSchema, payload)
        if (isError) {
            return wrapper.responseErrors(res, 'failed, payload not suited', 400, error);
        }
        const userId = req.user.sub

        const result = await cartService.updateCartItem(userId, cartItemId, data)

        if (!result.isSuccess) {
            return wrapper.responseErrors(res, result.error, 404)
        }
        return wrapper.responseSuccess(res, 'success update cart item', result.data, 200);

    } catch (error) {
        console.log(error);
        return wrapper.responseErrors(res, 'failed update cart item, internal error', 500, error)
    }

}


exports.deleteCartItem = async (req, res) => {
    try {

        const cartItemId = req.params.cartItemId
        const userId = req.user.sub

        const result = await cartService.deleteCartItem(userId, cartItemId)
        if (!result.isSuccess) {
            return wrapper.responseErrors(res, result.error, 404)
        }
        return wrapper.responseSuccess(res, 'success delete cart item', result.data, 200);

    } catch (error) {
        console.log(error);
        return wrapper.responseErrors(res, 'failed delete cart item, internal error', 500, error)
    }
}