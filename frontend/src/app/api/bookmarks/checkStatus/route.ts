import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import Bookmark from "@/app/_models/bookmark";
import { dbConnect } from "@/app/_utils/db";

export async function GET(req:NextRequest) {
    await dbConnect()
    const session = await auth()
    const searchParams = req.nextUrl.searchParams
    const wtId = searchParams.get('wtId')
    if (session?.user) {
        const existingBookmark = await Bookmark.findOne({
            userRef: session.user.id,
            wtRef: wtId
        })

        if (existingBookmark) {
            return NextResponse.json({
                isBookmarked: true
            })
        } else {
            return NextResponse.json({
                isBookmarked: false
            })
        }
        
    } else {
        return NextResponse.json({
            message: 'User is not logged in'
        }, {
            status: 500
        })
    }
    
  
}