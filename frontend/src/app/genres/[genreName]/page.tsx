import ViewGenreWt from "@/app/_components/viewGenre"
import apiUrl from "@/app/_utils/apiEndpoint"
import { Divider } from "@nextui-org/react"
import { notFound } from "next/navigation"
import Genre from "@/app/_models/genre"
import Wt from "@/app/_models/wt"
import Wtc from '@/app/_models/wtChapter'
import { dbConnect } from "@/app/_utils/db"

async function getWts(params:any) {
    try {
        await dbConnect()
        const limit = 20       
        const page = 1
        const slug = params.genreName
        let matchStage:any = {

        }
        const genre = await Genre.find({slug:slug})
        
        const genreId = genre[0]._id
        const sort = 'latest'
        
        let countQuery = {
            
        }
        let sortCondition = {

        }
        let aggSortCondition = {

        }
        const skip = (page - 1) * limit
        
        if (genre) {
            matchStage.$match = {
                genres: genreId
            }
            countQuery = {
                genres: genreId
            }
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
        

        const json = {
            wts: updates,
            totalPages: totalPages,
            genre: genre,
            totalWt: totalWt,
            fullArr: sortedWt
        }

        return JSON.parse(JSON.stringify(json))
                

    } catch (err) {
        console.error(err)
    }
}


export default async function Page ({params}:any) {
    /* console.log('PARAMS FROM PAGE GENRE', params) */
    const wts = await getWts(params)
    /* console.log('wts by genre', wts) */
    if (!wts) {
        notFound()
    }
    

    return (
        <main>
        <div className="max-w-[1024px] flex flex-col p-2 w-full gap-4">
            <div className="p-2">
                <div className="flex gap-2 items-center pt-4 pb-2">
                <h3 className="text-lg font-bold">
                {wts.genre[0].name}
                </h3>
            <span>
            {`( ${wts.totalWt} )`}
            </span>
            </div>
            <span className="text-default-500">
                {wts.genre[0].description}
            </span>
            <Divider className="my-4"></Divider>
            </div>
            <ViewGenreWt wtsArr={wts} totalPg={wts.totalPages} genreName={params.genreName}></ViewGenreWt>
        </div>
        </main>
    )
}