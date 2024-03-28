const mongoose = require('mongoose')
const Schema = mongoose.Schema


const RatingSchema = new Schema({
    rating: {
        type:Number,
        required: true,
        min: 1,
        max: 5
    },
    ratedBy: {
        type:String,
        required: true
    },
    wtRef: {
        type:Schema.Types.ObjectId,
        required: true,
        ref: 'WT'
        
    },
    createdAt: {
        type:Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Rating', RatingSchema)