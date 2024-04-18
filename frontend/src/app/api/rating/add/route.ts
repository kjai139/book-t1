import { dbConnect } from "@/app/_utils/db";
import { NextRequest, NextResponse } from "next/server";
import Rating from "@/app/_models/rating";

export async function POST(req:NextRequest) {
    try {
        const body = await req.json()
        const wtId = body.wtId
        const rating = body.rating
        const tempId = body.tempId
        await dbConnect()
       
        const hasUserRated = await Rating.findOne({wtRef: wtId, ratedBy: tempId})
        if (hasUserRated) {
            return NextResponse.json({
                message: 'You have already rated this.',
                code: 409
            }, {
                status: 409
            })
        } else {
            const newRating = new Rating({
                wtRef: wtId,
                ratedBy: tempId,
                rating: Number(rating)
            })

            await newRating.save()
            return NextResponse.json({
                message: 'Thanks for your rating!'
            })
        }

    } catch (err:any) {
        return NextResponse.json({
            message: err.message
        }, {
            status: 500
        })
    }
}