import { NextRequest, NextResponse } from "next/server";
import Wt from "@/app/_models/wt";
import { dbConnect } from "@/app/_utils/db";

export async function GET(req:NextRequest) {
    try {
        await dbConnect()
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