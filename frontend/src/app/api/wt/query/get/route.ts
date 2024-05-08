import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/app/_utils/db";
import Wt from "@/app/_models/wt";
import Wtc from "@/app/_models/wtChapter";


export async function GET(req:NextRequest) {
    try {
        await dbConnect()
        const limit = 20
        const searchParams = req.nextUrl.searchParams
        const statusData = searchParams.get('status')
        const order = searchParams.get('order')
        const page = Number(searchParams.get('page'))
        const genresData = searchParams.get('genres')
        let genres
        let status
        if (genresData) {
            genres = JSON.parse(genresData)
        }
        if (statusData) {
            status = JSON.parse(statusData)
        }
        console.log('statusData', statusData)
        console.log('genresData', genresData)
        const genresObjIds = genres?.map((id:string) => mongoose.Types.ObjectId.createFromHexString(id))
        const statusObjIds = status?.map((id:string) => mongoose.Types.ObjectId.createFromHexString(id))
        let matchStage:any = {
            $match: {
                
            }
        }
        let countQuery:any = {
           
        }
        let sortCondition = {

        }
        let aggreSortCondition = {

        }
        const skip = (page - 1) * limit
        if (status.length > 0) {
            console.log(statusObjIds)
            matchStage.$match.wtStatus = {$in: statusObjIds}
            countQuery.wtStatus = {$in: statusObjIds}
        }
        if (genres.length > 0) {
            matchStage.$match.genres = {
                $all: genresObjIds
            }
            countQuery.genres = {
                $all: genres
            }
        }
        if (order === 'latest') {
            sortCondition = { updatedOn : -1}
            aggreSortCondition = {
                "book.updatedOn": -1
            }
        } else if (order === 'rating') {
            sortCondition = {
                avgRating: -1,
                updatedOn: -1
            }
            aggreSortCondition = {
                "book.avgRating": -1,
                "book.updatedOn": -1
            }
        }
        const totalWt = await Wt.countDocuments(countQuery)
        
        const totalPages = Math.ceil(totalWt / limit)

        const updates = await Wt.aggregate([
            matchStage,
            {
                $sort: sortCondition
            },
            {
                $skip: skip

            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: Wtc.collection.name,
                    localField: '_id',
                    foreignField: 'wtRef',
                    as: 'chapters'
                    //localField(cur collection) matches the foreignfield(from collection)
                }
            },
            {
                $unwind: '$chapters'
            },
            {
                $sort: { 'chapters.chapterNumber': -1 }
            },
            {
                $group: {
                    //grouping by the Book's id
                    _id: '$_id',
                    chapters: { $push: '$chapters' },
                    book: { $first: '$$ROOT'}
                }
            },
            {
                $project: {
                    _id: 0,
                    book: 1,
                    chapters: { $slice: ['$chapters', 2]}
                }
            },
            {
                $unset: "book.chapters"
            },
            {
                $sort: aggreSortCondition
            }
        ])

        

        return NextResponse.json({
            wts: updates,
            totalPages: totalPages,
            totalWt: totalWt
        })

    } catch (err:any) {
        return NextResponse.json({
            message:err.message
        }, {
            status: 500
        })
    }
}