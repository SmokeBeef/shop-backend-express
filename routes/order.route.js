const express = require('express');

const router = express.Router()

const { authVerrifiy } = require('../auth/authVerify');
const { createOrder, getMyOrder, uploadProof, trackOrder } = require('../controllers/order.controller');


router.post('/orders', authVerrifiy, createOrder)
router.post('/orders/:orderId/proof', authVerrifiy, uploadProof)
router.get('/orders', authVerrifiy, getMyOrder)
router.get('/orders/:orderId/track', authVerrifiy, trackOrder)

exports.orderRoute = router;