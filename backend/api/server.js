const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 4000
const mongodb = process.env.MONGO_DB
const cors = require('cors')
const mongoose = require('mongoose')


const main = async () => {
    try {
        mongoose.connect(mongodb)
        console.log('mongodb connected')


    } catch (err) {
        console.log(err)
    }
}

main()


app.listen(port, () => {
    console.log(`server running on ${port}.`)
})