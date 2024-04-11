const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GenreSchema = new Schema({
    name: {
        type:String,
        required: true,
        unique:true
        
    },
    lcname: {
        type:String,
        required: true,
        unique: true
    },
    description: {
        type:String
    },
    slug: {
        type:String,
        unique:true
    }

})

module.exports = mongoose.model('Genre', GenreSchema)