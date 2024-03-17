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
    },
    author: {
        type: String,

    },
    artist: {
        type:String
    },
    altName: {
        type: String,
    },
    status: {
        type:String,
        enum: ['Ongoing', 'Finished', 'Hiatus']
    },
    releasedYear: {
        type:String,

    },
    serialization: {
        type:String
    },
    updatedOn: {
        type:Date,

    },
    tlGroup: {
        type:String,
        default: ''
    }
    
})

/* WTSchema.pre('save', function(next) {
    if (this.isModified('chapters')) {
        this.updatedOn = new Date()
    }

    next()
}) */

module.exports = mongoose.model('WT', WTSchema)