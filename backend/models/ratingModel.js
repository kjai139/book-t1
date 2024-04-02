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

RatingSchema.post('save', async function(doc) {
    await doc.populate('wtRef')
    doc.wtRef.calculateAvgRating()
})

RatingSchema.post('remove', async function(doc) {
    await doc.populate('wtRef')
    doc.wtRef.calculateAvgRating()
})

module.exports = mongoose.model('Rating', RatingSchema)