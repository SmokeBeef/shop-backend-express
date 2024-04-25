const express = require('express');
const { register, login, me, accountVerify } = require('../controllers/auth.controller');
const { authVerrifiy } = require('../auth/authVerify');

const route = express.Router();


route.post('/auth/register', register)
route.post('/auth/login', login)

route.get('/auth/me', authVerrifiy, me)

route.get('/auth/verify/:userId', accountVerify)


exports.authRoute = route