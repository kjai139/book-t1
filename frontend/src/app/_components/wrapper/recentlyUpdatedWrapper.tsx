import RecentlyDisplayed from "../grid/recentlyUpdated"
import Wt from "@/app/_models/wt"
import Wtc from "@/app/_models/wtChapter"
import { dbConnect } from "@/app/_utils/db"
import { cache } from "react"
import { formatDateDMY } from "@/app/_utils/dates"


export const revalidate = 3600

const GetRecentlyUpdated = cache(async () => {
    await dbConnect()
    const sevendaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const page = 1
    const limit = 50

    try {
        const updates = await Wt.aggregate([
            {
                $match: {
                    updatedOn: { $gte: sevendaysAgo }
                }
            },
            {
                $sort: { updatedOn: -1}
            },
            {
                $skip: (page - 1) * limit

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
                $sort: {
                    "book.updatedOn": -1
                }
            }
        ])


        /* const totalCount = await Wt.countDocuments({
            updatedOn: { $gte: sevendaysAgo }
        })

        const totalPages = Math.ceil(totalCount / limit)

        const slider = await Wt.aggregate([
            {
                $lookup: {
                    from: 'genres',
                    localField: 'genres',
                    foreignField: '_id',
                    as: 'genres'
                }//serves as populate
            }
        ]).sample(6) */

        


        const json = {
            updates: updates,
            /* totalPages: totalPages, */
            /* slider: slider */
        }

        return JSON.parse(JSON.stringify(json))

    } catch (err:any) {
        console.error(err)
    }

    
})

export default async function RecentlyUpdatedWrapper () {
    const updates = await GetRecentlyUpdated()
 
    updates.updates = updates.updates.map((node:any) => {
        const updatedChapters = node.chapters.map((chapter:any) => {
        console.log('chapter', chapter)
        const formattedDate = formatDateDMY(chapter.releasedAt)


        return {
            ...chapter,
            releasedAt: formattedDate
        }
        
        })

        return {
        ...node,
        chapters: updatedChapters
        }
    })

    return (
        <RecentlyDisplayed updatesArr={updates}></RecentlyDisplayed>
    )
}