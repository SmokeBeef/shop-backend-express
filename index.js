const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { authRoute } = require('./routes/auth.route')



const app = express()


dotenv.config()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.use(authRoute)

app.listen(3000, () => {
    console.log('app run on port 3000');
})