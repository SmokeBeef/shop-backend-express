
const express = require('express');
const { authVerrifiy } = require('../auth/authVerify');
const { getRates } = require('../controllers/rates.controller');

const router = express.Router();

router.post('/rates', authVerrifiy, getRates)

exports.ratesRoute = router;