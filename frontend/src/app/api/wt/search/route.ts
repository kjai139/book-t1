import { NextRequest, NextResponse } from "next/server";
import Wt from "@/app/_models/wt";
import Genre from "@/app/_models/genre";

export async function GET(req:NextRequest) {

    try {
        const name:any = req.nextUrl.searchParams.get('name')
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
        return NextResponse.json({
            message: err.message
        }, {
            status: 500
        })
    }
}