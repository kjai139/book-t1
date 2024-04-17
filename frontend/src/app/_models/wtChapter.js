const mongoose = require('mongoose')
const Schema = mongoose.Schema


const WTChapterSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
        
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
    },
    releasedAt: {
        type:Date,
        default:Date.now
    }
})

export default mongoose.models.WTChapter || mongoose.model('WTChapter', WTChapterSchema)