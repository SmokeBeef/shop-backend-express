const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { authRoute } = require('./routes/auth.route')
const { productRoute } = require('./routes/product.route')
const { categoryRoute } = require('./routes/category.route')
const { cartRoute } = require('./routes/cart.route')
const { shopRoute } = require('./routes/shop.route')



const app = express()


dotenv.config({path: '.env'})
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static('public'))

app.use(authRoute)
app.use(categoryRoute)
app.use(productRoute)
app.use(cartRoute)
app.use(shopRoute)

app.use('*', (req, res) => {
    return res.status(404).json({
        message: 'route not found',
        code: 404,
        success: false,
        errors: null,
        data: null
    })
})
app.listen(3000, () => {
    console.log('app run on port 3000');
})