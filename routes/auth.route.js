const express = require('express');
const { register, login, me } = require('../controllers/auth.controller');
const { authVerrifiy } = require('../auth/authVerify');

const route = express.Router();


route.post('/auth/register', register)
route.post('/auth/login', login)

// middleware
route.use(authVerrifiy)
route.get('/auth/me', me)



exports.authRoute = route