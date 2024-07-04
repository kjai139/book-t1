const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookmarkSchema = new Schema({
    url: {
        type:String,
        required: true,
    },
    wtId: {
        type:Schema.Types.ObjectId,
        ref: 'WT',
        required: true
    },
    latestUrl: [
        {
            url: {
                type:String,
            }
        }
    ],
    userRef: {
        type:Schema.Types.ObjectId,
        
    }
})

export default mongoose.models.Bookmark || mongoose.model('Bookmark', bookmarkSchema)