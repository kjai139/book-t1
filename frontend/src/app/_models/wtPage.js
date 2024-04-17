const mongoose = require('mongoose')
const Schema = mongoose.Schema


const WtPageSchema = new Schema({
    pageNum: {
        type:Number,
        required: true
    },
    chapterRef: {
        type: Schema.Types.ObjectId,
        ref: 'WTChapter',
        required: true
    },
    url: {
        type:String,
        required: true
    },
    imgHeight: {
        type:Number
    },
    imgWidth: {
        type:Number
    }
})


export default mongoose.models.WtPage || mongoose.model('WtPage', WtPageSchema)