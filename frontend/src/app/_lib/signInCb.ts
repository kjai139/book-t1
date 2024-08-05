/* 
import mongoose from "mongoose";
import { dbConnect } from "../_utils/db";
const Schema = mongoose.Schema
import { generateRandomName } from "../_utils/generateName";
import bcrypt from 'bcryptjs'


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
export async function getUserId (email:string) {
    try {
        await dbConnect()
        const User = mongoose.models.User || mongoose.model('User', UserSchema)
        if (!User) {
            throw new Error('User model not defined')
        }
        const normalizedEmail = email.toLowerCase()
        const existingUser = await User.findOne({
            email: normalizedEmail
        })
     

        if (existingUser) {
            return existingUser._id
        } else {
            console.log('Could not find user from database, creating account...')
            let userName 
            let isUnique = false
            while (!isUnique) {
                userName = generateRandomName()
                let lcUsername = userName.toLowerCase()
                let isNameTaken = await User.findOne({
                    lcname: lcUsername
                })
                if (!isNameTaken) {
                    isUnique = true
                }
            }
            const randomPw = generateRandomName() + 'temp'
            const saltRounds = 10
            const salt = await bcrypt.genSalt(saltRounds)
            const hashedPw = await bcrypt.hash(randomPw, salt)
            const newUser = new User({
                name: userName,
                lcname: userName!.toLowerCase(),
                email: email,
                password: hashedPw
            })

            await newUser.save()
            return newUser._id
        }
    } catch (err) {
        console.error(err)
        return false
    }
} */