const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 4000
const mongodb = process.env.MONGO_DB
const cors = require('cors')
const mongoose = require('mongoose')
const apiRouter = require('./routes/api')
const allowedOrigins = ['http://localhost:3000']
const cookieParser = require('cookie-parser')


const main = async () => {
    try {
        mongoose.connect(mongodb)
        console.log('mongodb connected')


    } catch (err) {
        console.log(err)
    }
}

main()
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use('/api', apiRouter)


app.listen(port, () => {
    console.log(`server running on ${port}.`)
})