import { NextRequest, NextResponse } from "next/server";
import Wt from "@/app/_models/wt";


export async function GET(req:NextRequest) {
    try {
        const allWt = await Wt.find().sort({name: 1})
        
        return NextResponse.json({
            allWt: allWt
        })

    } catch (err:any) {
        return NextResponse.json({
            message: err.message
        }, {
            status: 500
        })
    }
}