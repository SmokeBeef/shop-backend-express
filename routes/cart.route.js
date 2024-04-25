const express = require('express');
const { authVerrifiy } = require('../auth/authVerify');
const { addCartItem, getUserCart, updateCart, deleteCartItem } = require('../controllers/cart.controller');

const route = express.Router();

route.post('/carts/items', authVerrifiy, addCartItem);
route.get('/carts', authVerrifiy, getUserCart);
route.put('/carts/items/:cartItemId', authVerrifiy, updateCart);
route.delete('/carts/items/:cartItemId', authVerrifiy, deleteCartItem);

exports.cartRoute = route;