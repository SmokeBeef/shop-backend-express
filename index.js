const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { authRoute } = require('./routes/auth.route')
const { productRoute } = require('./routes/product.route')
const { categoryRoute } = require('./routes/category.route')
const { cartRoute } = require('./routes/cart.route')
const { shopRoute } = require('./routes/shop.route')
const { mapsRoute } = require('./routes/maps.route')
const { courierRoute } = require('./routes/courier.route')
const { rateLimit } = require('express-rate-limit')
const { ratesRoute } = require('./routes/rates.route')
const { orderRoute } = require('./routes/order.route')



const app = express()

const ratelimit = rateLimit({
    windowMs: 60000,
    limit: 60,
    message: {
        code: 429,
        message: 'Too many requests from this IP, please try again after a minute',
        success: false,
        errors: null,
    },
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(ratelimit)

dotenv.config({ path: '.env' })
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static('public'))

app.use(authRoute)
app.use(categoryRoute)
app.use(productRoute)
app.use(cartRoute)
app.use(shopRoute)
app.use(mapsRoute)
app.use(courierRoute)
app.use(ratesRoute)
app.use(orderRoute)

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