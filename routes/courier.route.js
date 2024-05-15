const express = require('express');
const { getCourier } = require('../controllers/courier.controller');
const { authVerrifiy } = require('../auth/authVerify');

const router = express.Router();

router.get('/couriers', authVerrifiy, getCourier)

exports.courierRoute = router;