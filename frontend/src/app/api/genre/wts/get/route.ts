import { NextRequest, NextResponse } from "next/server";
import Genre from "@/app/_models/genre";
import Wt from "@/app/_models/wt";
import Wtc from "@/app/_models/wtChapter";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
       
     
    try {
        const limit = 20
        const status = searchParams.get('status')
        const sort = searchParams.get('sort')
        const page = Number(searchParams.get('page'))
        const slug = searchParams.get('slug') 
        const genre = await Genre.find({slug:slug})   
        const genreId = genre[0]._id

        let matchStage:any = {
            $match: {
                
            }
        }
        let countQuery:any = {
           
        }
        let sortCondition = {

        }
        let aggSortCondition = {

        }
        const skip = (page - 1) * limit
        if (status) {
            matchStage.$match.status = status
            countQuery.status = status
        }
        if (genre) {
            
            matchStage.$match.genres = genreId
            countQuery.genres = genreId
        }
        if (sort === 'latest') {
            sortCondition = {
                updatedOn: -1
            }
            aggSortCondition = {
                "book.updatedOn": -1
            }
        } else if (sort === 'rating') {
            sortCondition = {
                avgRating: -1,
                updatedOn: -1
                
            }
            aggSortCondition = {
                "book.avgRating": -1,
                "book.updatedOn": -1
            }
        }
        const totalWt = await Wt.countDocuments(countQuery)
        
        const totalPages = Math.ceil(totalWt / limit)
       
        const sortedWt = await Wt.find().sort({
            avgRating: -1,
            updatedOn: -1
        }).skip(skip).limit(limit)
        

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
                    book: { $first: '$$ROOT'},
                   
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
                $sort: aggSortCondition
            }
        ])
        

        return NextResponse.json({
            wts: updates,
            totalPages: totalPages,
            genre: genre,
            totalWt: totalWt,
            fullArr: sortedWt
        })

    } catch (err:any) {
        return NextResponse.json({
            message: err.message
        }, {
            status: 500
        })
    }


    

}