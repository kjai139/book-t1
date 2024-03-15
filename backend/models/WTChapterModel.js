const mongoose = require('mongoose')
const Schema = mongoose.Schema


const WTChapterSchema = new Schema({
    name: {
        type: String,
        required: true,
        
    },
    wtRef: {
        type:Schema.Types.ObjectId,
        ref: 'WT'
    },
    createdAt: {
        type:Date,
        default: Date.now
    },
    chapterNumber: {
        type:Number,
        required: true,
        unique: true
    },
    releasedAt: {
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('WTChapter', WTChapterSchema)