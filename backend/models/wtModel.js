const mongoose = require('mongoose')
const Schema = mongoose.Schema


const WTSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    genres: [{
        type: Schema.Types.ObjectId,
        ref: 'Genre'
    }],
    image: {
        type:String,

    },
    createdAt: {
        type:Date,
        default: Date.now
    },
    about: {
        type:String,
        required: true
    }
    
})

module.exports = mongoose.model('WT', WTSchema)