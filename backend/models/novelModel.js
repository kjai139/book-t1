const mongoose = require('mongoose')
const Schema = mongoose.Schema


const NovelSchema = new Schema({
    name: {
        type:String,
        unique: true,
        required: true
    },
    createdAt: {
        type:Date,
        default: Date.now
    },
    image: {
        type: String,
        default: null
    },
    genres: [{
        type:Schema.Types.ObjectId,
        ref: 'Genre'

    }],
    about: {
        type:String,
        required: true
    }
    
})


module.exports = mongoose.model('Novel', NovelSchema)