import { NextRequest, NextResponse } from "next/server"
import { object, string } from 'yup'
import User from "@/app/_models/users"
const bcrypt = require('bcrypt')
import { createSession } from "@/app/_lib/session"
import { dbConnect } from "@/app/_utils/db"

let userSchema = object({
    username: string().required().max(15).matches(/^[a-zA-Z0-9_]+$/, 'No funny characters'),
    password: string().required()
})

export async function POST(req:NextRequest) {
    const body = await req.json()
    try {
       
        await userSchema.validate(body)
        await dbConnect()
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
                    

                    const user = await createSession({
                        _id: theUser._id,
                        name: theUser.name
                    })

    
                    return NextResponse.json({
                        message: 'success',
                        user: user
                    })
                } else {
                    return NextResponse.json({
                        message: 'Incorrect credentials'
                    }, {
                        status: 401
                    })
                }
            }

    } catch (err:any) {
        console.log(err)
        return NextResponse.json({
            message: err.message
        }, {
            status: 500
        })
    }
            
}