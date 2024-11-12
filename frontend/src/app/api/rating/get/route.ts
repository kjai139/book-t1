import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/_utils/db";
import Wt from "@/app/_models/wt";
import Rating from "@/app/_models/rating"
import { auth } from "@/auth";

export async function GET(req:NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const wtId = searchParams.get('wtId')
    const tempId = searchParams.get('tempId')
    const session = await auth()

    try {
        await dbConnect()
        const results = await Wt.findById(wtId)
        /* const totalRated = await Rating.countDocuments({wtRef: wtId }) */
        
        
        if (session?.user.id) {
            console.log(`[Get Rating Routehandler] User ${session.user.id} is logged in.`)
            const didUserRate = await Rating.findOne({
                wtRef: wtId,
                userRef: session.user.id
                
            })

            return NextResponse.json({
                results: results.avgRating,
                didUserRate: didUserRate
            })
        }

        const didUserRate = await Rating.findOne({wtRef: wtId, ratedBy: tempId})
        console.log(`[Get Rating Routehandler] User is on temp ${tempId}`)

        return NextResponse.json({
            results: results.avgRating,
            didUserRate: didUserRate,
           /*  totalRated: totalRated */
        })


    } catch (err:any) {
       return NextResponse.json({
            message: err.message
       }, {
        status: 500
       })
    }
}






