import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import Bookmark from "@/app/_models/bookmark";

export async function GET(req:NextRequest) {
    const session = await auth()
    const searchParams = req.nextUrl.searchParams
    const wtId = searchParams.get('wtId')
    if (session?.user) {
        return NextResponse.json({
            message: 'user is logged in'
        })
    } else {
        return NextResponse.json({
            message: 'User is not logged in'
        }, {
            status: 500
        })
    }
    
  
}