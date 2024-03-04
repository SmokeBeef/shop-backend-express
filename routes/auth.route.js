const express = require('express');
const { register, login } = require('../controller/auth.controller');

const route = express.Router();


route.post('/auth/register', register)
route.post('/auth/login', login)



exports.authRoute = route