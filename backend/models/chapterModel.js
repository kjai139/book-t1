const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ChapterSchema = new Schema({
    name: {
        type: String,
        required: true,
        
    },
    parentStory: {
        type:Schema.Types.ObjectId,
        refPath: 'parentType'
    },
    parentType: {
        type:String,
        enum: ['Novel', 'WT']
    },
    createdAt: {
        type:Date,
        default: Date.now
    },
    chNumber: {
        type:Number
    }
})

module.exports = mongoose.model('Chapter', ChapterSchema)