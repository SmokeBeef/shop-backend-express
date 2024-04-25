
const express = require('express')
const { addShop } = require('../controllers/shop.controller')
const { authVerrifiy } = require('../auth/authVerify')

const router = express.Router()


router.post('/shops', authVerrifiy, addShop)


exports.shopRoute = router