import Genre from "@/app/_models/genre"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req:NextRequest) {
    try {
        const allGenres = await Genre.find().sort({name: 1})

        return NextResponse.json({
            genres: allGenres
        })



    } catch (err:any) {
        return NextResponse.json({
            message: err.message
        }, {
            status: 500
        })
    }
}