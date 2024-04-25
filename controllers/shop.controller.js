const { createShopSchema } = require('../schema/shop.schema')
const { validate } = require('../utils/validator')
const wrapper = require('../utils/wrapper')
const shopService = require('../service/shop.service')
const multer = require('multer')
const fs = require('fs')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileDestination = 'public/shop-image'

        if (!fs.existsSync(fileDestination))
            fs.mkdirSync(fileDestination)

        return cb(null, fileDestination)
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`)
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


exports.addShop = async (req, res) => {
    upload(req, res, async (err) => {
        try {
            const payload = {
                ...req.body,
                user_id: req.user.sub
            }
            if (req.file) {
                payload.image = '/shop-image/' + req.file.filename
            }
            const { data, error, isError } = validate(createShopSchema, payload)
            if (isError) {
                fs.unlinkSync('public' + payload.image)
                return wrapper.responseErrors(res, 'failed, payload not suited', 400, error);
            }
            
            const result = await shopService.createShop(data)
            
            if (!result.isSuccess) {
                fs.unlinkSync('public' + payload.image)
                return wrapper.responseErrors(res, result.error, 409)
            }

            return wrapper.responseSuccess(res, 'success create new shop', result.data, 201)

        } catch (error) {
            console.log(error);
            fs.unlinkSync('public/shop-image/' + req.file.filename)
            return wrapper.responseErrors(res, 'internal error', 500)
        }
    })
}


exports.getShops = async (req, res) => {
    try {
        
    } catch (error) {
        return wrapper.responseErrors(res, 'internal error',500)
    }

}