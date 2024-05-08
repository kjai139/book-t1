const mongoose = require('mongoose')
const Schema = mongoose.Schema


const StatusSchema = new Schema({
    name: {
        type:String,
        required: true,
        unique:true
    },
    slug: {
        type:String,
        unique:true
    }
})


module.exports = mongoose.model('Status', StatusSchema)