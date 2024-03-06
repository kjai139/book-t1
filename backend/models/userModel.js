const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    role: {
        type:String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    image: {
        type:String,
        default: null
    },
    bio: {
        type:String,
        default: null
    }
})

module.exports = mongoose.model('User', UserSchema)
