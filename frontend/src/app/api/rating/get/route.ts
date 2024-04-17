import { NextRequest, NextResponse } from "next/server";
import Wt from "@/app/_models/wt";
import Rating from "@/app/_models/rating"

export async function GET(req:NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const wtId = searchParams.get('wtId')
    const tempId = searchParams.get('tempId')

    try {
        const results = await Wt.findById(wtId)
        const totalRated = await Rating.countDocuments({wtRef: wtId })

        const didUserRate = await Rating.findOne({wtRef: wtId, ratedBy: tempId})

        return NextResponse.json({
            results: results.avgRating,
            didUserRate: didUserRate,
            totalRated: totalRated
        })


    } catch (err:any) {
       return NextResponse.json({
            message: err.message
       }, {
        status: 500
       })
    }
}






