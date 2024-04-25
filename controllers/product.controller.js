const { createProductSchema, getProductsQuerySchema } = require('../schema/product.schema')
const { validate } = require('../utils/validator')
const wrapper = require('../utils/wrapper')
const productService = require('../service/product.service')
const fs = require('fs')

const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        const fileDestination = 'public/product-image'
        if (!fs.existsSync(fileDestination))
            fs.mkdirSync(fileDestination)

        return cb(null, fileDestination)
    },
    filename: (req, file, cb) => {
        return cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2056 * 1000
    },
    fileFilter(req, file, cb) {
        const mimetype = file.mimetype
        const mimeAllow = ['image/jpg', 'image/png', 'image/jpeg']
        if (!mimeAllow.includes(mimetype))
            return cb(new Error('file type not allow'), false)
        return cb(null, true)
    }
}).single('image')


exports.addProduct = async (req, res) => {
    upload(req, res, async (err) => {
        try {
            if (err)
                return wrapper.responseErrors(res, err.message, 400)
            if (!req.file) {
                return wrapper.responseErrors(res, 'image not uploaded', 400, { image: 'image is required' })
            }
            const payload = {
                ...req.body,
                image: '/product-image/' + req.file.filename,
                user_id: req.user.sub,
            }
            if (req.body.product_types)
                payload.product_types = JSON.parse(req.body.product_types)

            const { data, error, isError } = validate(createProductSchema, payload)

            if (isError) {
                fs.unlink('public' + payload.image, (err) => { })
                return wrapper.responseErrors(res, 'payload not suited', 400, error)
            }

            const result = await productService.createProduct(data)

            if (!result.isSuccess) {
                fs.unlink('public' + payload.image, (err) => { })
                return wrapper.responseErrors(res, result.error, 404)
            }

            return wrapper.responseSuccess(res, 'success create new product', result.data, 201)

        } catch (error) {
            fs.unlink('public' + '/product-image/' + req.file.filename, (err) => { })
            console.log(error);
            return wrapper.responseErrors(res, 'failed create product, internal error', 500, error)
        }
    })
}

exports.getProducts = async (req, res) => {
    try {

        const { data, error, isError } = validate(getProductsQuerySchema, req.query)

        if (isError) {
            return wrapper.responseErrors(res, 'query option not correct', 400, error)
        }

        const result = await productService.getProducts(data.page, data.limit, data.search, data.categoryId)

        return wrapper.responseSuccess(res, 'success get products', result.data, 200, result.meta)

    } catch (error) {
        console.log(error);
        return wrapper.responseErrors(res, 'failed get product, internal error', 500, error)
    }
}

exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.productId

        const result = await productService.getProductById(productId)

        if (!result.isSuccess) {
            return wrapper.responseErrors(res, 'product not found', 404, null)
        }

        return wrapper.responseSuccess(res, 'success get product by id', result.data, 200)

    } catch (error) {
        return wrapper.responseErrors(res, 'failed get product, internal error', 500, error)
    }
}