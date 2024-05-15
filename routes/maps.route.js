const express = require('express');
const { getMaps } = require('../controllers/maps.controller');
const { authVerrifiy } = require('../auth/authVerify')
const router = express.Router();

router.get('/maps/areas/:input', authVerrifiy, getMaps)

exports.mapsRoute = router;