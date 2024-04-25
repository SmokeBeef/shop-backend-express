const express = require('express');
const { authVerrifiy } = require('../auth/authVerify');
const { addCategory, getCategories } = require('../controllers/category.controller');

const route = express.Router();


route.post('/categories', authVerrifiy, addCategory)
route.get('/categories', authVerrifiy, getCategories)



exports.categoryRoute = route