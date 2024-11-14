import { NextRequest, NextResponse } from "next/server";
import Wt from "@/app/_models/wt";
import { dbConnect } from "@/app/_utils/db";

export async function GET(req:NextRequest) {
    try {
        await dbConnect()
        const allWt = await Wt.find().sort({name: 1})
        
        
        const response = NextResponse.json({
            allWt: allWt
        })
        response.headers.set('Netlify-CDN-Cache-Control', 'public, max-age=120, stale-while-revalidate=120')

        return response

    } catch (err:any) {
        return NextResponse.json({
            message: err.message
        }, {
            status: 500
        })
    }
}