import { NextRequest, NextResponse } from "next/server";
import Wt from "@/app/_models/wt";
import Genre from "@/app/_models/genre";
import { dbConnect } from "@/app/_utils/db";

export async function GET(req:NextRequest) {
    const name:any = req.nextUrl.searchParams.get('name')
    try {
        await dbConnect()
        
        if (!name || typeof name !== 'string' || name.trim() === '') {
            throw new Error('invalid query type')
        }

        const isValidString = /^[a-zA-Z0-9\s']*$/g.test(name);

        if (!isValidString) {
            throw new Error('wtf you doing')
        }

        const escapedTxt = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        
        const regex = new RegExp(escapedTxt, 'i')
        
        const results = await Wt.find({
            name: {
                $regex: regex
            }
        }).populate({ path:'genres', model: Genre})

        return NextResponse.json({
            results: results
        })
    
        
    } catch (err:any) {
        console.error(err)
        return NextResponse.json({
            message: err.message
        }, {
            status: 500
        })
    }
}