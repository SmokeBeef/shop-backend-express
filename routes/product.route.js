
const express = require('express')
const { addProduct, getProducts,getProductById } = require('../controllers/product.controller')
const { authVerrifiy } = require('../auth/authVerify')

const route = express.Router()

route.post('/products', authVerrifiy, addProduct)
route.get('/products', authVerrifiy, getProducts)
route.get('/products/:productId', authVerrifiy, getProductById)


exports.productRoute = route