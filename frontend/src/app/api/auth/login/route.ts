import { NextRequest, NextResponse } from "next/server"
import { object, string, InferType } from 'yup'
import User from "@/app/_models/users"
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
import { cookies } from "next/headers"

let userSchema = object({
    username: string().required().max(15),
    password: string().required()
})

export async function POST(req:NextRequest) {
    const body = await req.json()
    try {
        await userSchema.validate(body)

        const normalizedName = body.username.toLowerCase()
        const theUser = await User.findOne({lcname: normalizedName})
            if (!theUser) {
                return NextResponse.json({
                    message: 'Incorrect credentials'
                }, {
                    status: 400
                })
            } else {
                const pwMatch = await bcrypt.compare(body.password, theUser.password)
                if (pwMatch) {
                    const token = jwt.sign({
                        _id: theUser._id,
                        name: theUser.name
                    }, process.env.JWT_SECRET, {
                        expiresIn: '1h'
                    })
    
                    cookies().set('jwt', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production'
                    })
    
                    return NextResponse.json({
                        success:true
                    })
                } else {
                    return NextResponse.json({
                        message: 'Incorrect credentials'
                    }, {
                        status: 401
                    })
                }
            }

    } catch (err) {
        console.log(err)
        return NextResponse.json({
            message: err
        }, {
            status: 500
        })
    }
            
}