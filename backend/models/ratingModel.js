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
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type:Schema.Types.ObjectId,
        required: true,
        refPath: 'itemType'
    },
    itemType: {
        type:String,
        enum: ['Novel', 'WT']
    },
    createdAt: {
        type:Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Rating', RatingSchema)