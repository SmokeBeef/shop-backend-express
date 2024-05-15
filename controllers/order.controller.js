const { createOrderSchema } = require('../schema/order.schema');
const { validate } = require('../utils/validator');
const wrapper = require('../utils/wrapper');
const orderService = require('../service/order.service')

const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileDestination = 'public/order-proof'
        if (!fs.existsSync(fileDestination))
            fs.mkdirSync(fileDestination)
        return cb(null, fileDestination)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const mimetype = file.mimetype
        const mimeAllow = ['image/jpg', 'image/png', 'image/jpeg']
        if (!mimeAllow.includes(mimetype))
            return cb(new Error('file type not allow'), false)
        return cb(null, true)
    }
}).single('proof')

exports.createOrder = async (req, res) => {
    try {
        const payload = req.body
        const { data, error, isError } = validate(createOrderSchema, payload)
        if (isError) {
            return wrapper.responseErrors(res, 'failed to create order, missing properties', 400, error)
        }

        const result = await orderService.createOrder({ ...data, user_id: req.user.sub })

        if (!result.isSuccess)
            return wrapper.responseErrors(res, 'failed to create order', 400)
        return wrapper.responseSuccess(res, 'success create new order', result.data, 201)


    } catch (error) {
        console.log(error);
        return wrapper.responseErrors(res, 'failed to create order, there is internal error', 500, error)
    }
}

exports.getMyOrder = async (req, res) => {
    try {

        const result = await orderService.getUserOrder(req.user.sub)

        return wrapper.responseSuccess(res, 'success get my order', result.data, 200)

    } catch (error) {
        return wrapper.responseErrors(res, 'failed to get user order', 400, error)
    }
}

exports.uploadProof = async (req, res) => {
    upload(req, res, async err => {
        try {

            if (err)
                return wrapper.responseErrors(res, 'failed to upload proof', 500, err)
            if (!req.file)
                return wrapper.responseErrors(res, 'image not found', 400, err)

            const payload = {
                proof: '/order-proof/' + req.file.filename,
                order_id: req.params.orderId,
                user_id: req.user.sub,
            }

            const result = await orderService.uploadProof(payload)
            if (!result.isSuccess) {
                fs.unlink('public' + payload.proof, () => { })
                return wrapper.responseErrors(res, 'failed to upload proof', 404)
            }

            return wrapper.responseSuccess(res, 'success upload proof', result.data, 201)


        } catch (error) {
            fs.unlink('public/order-proof' + req.file.filename, () => { })
            return wrapper.responseErrors(res, 'failed to upload proof, internal error', 500, error)
        }
    })
}

exports.trackOrder = async (req,res) => {
    try {
        const data = {
            order_id: req.params.orderId,
            user_id: req.user.sub,
        }

        const result = await orderService.orderTrack(data)
        if (!result.isSuccess)
            return wrapper.responseErrors(res, 'failed to track order', 404)
        return wrapper.responseSuccess(res, 'order has been tracked', result.data, 200)
        
    } catch (error) {
        return wrapper.responseErrors(res, 'failed to upload proof, internal error', 500, error)
    }
}