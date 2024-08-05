const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    lcname: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required:true
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
    },
    isVerified: {
        type:Boolean,
        default: false
    },
    hasPwReset: {
        type:Boolean,
        default: true
    }
})

export default mongoose.models.User || mongoose.model('User', UserSchema)